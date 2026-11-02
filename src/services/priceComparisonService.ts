/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * PREÇO JUSTO ANGOLA — Serviço de Comparação e Inteligência de Preços
 */

import { Product, ProductVariant, Store, PriceRecord, ProductPriceComparison, PriceComparisonItem } from '../types';
import { STORES, INITIAL_PRICES, PRODUCTS } from '../data/luandaData';

// Cache em memória que aceita submissões dinâmicas do utilizador
let currentPrices: PriceRecord[] = [...INITIAL_PRICES];

export function getAllPrices(): PriceRecord[] {
  return currentPrices;
}

export function addPriceRecord(newPrice: PriceRecord): void {
  // Substitui ou adiciona novo registo preservando imutabilidade
  currentPrices = [newPrice, ...currentPrices];
}

export function updatePricesBulk(storeId: string, updates: Array<{ productId: string; variantId: string; newPrice: number }>): void {
  const timestamp = new Date().toISOString();
  const dateStr = timestamp.split('T')[0];
  const newRecords: PriceRecord[] = updates.map(u => {
    const prod = PRODUCTS.find(p => p.id === u.productId);
    const variant = prod?.variants.find(v => v.id === u.variantId);
    const normalizedPrice = variant && variant.packageQuantity > 0 
      ? Number((u.newPrice / variant.packageQuantity).toFixed(1))
      : u.newPrice;

    return {
      id: `bulk_${storeId}_${u.variantId}_${Date.now()}`,
      productId: u.productId,
      variantId: u.variantId,
      storeId,
      priceAmount: u.newPrice,
      normalizedPrice,
      sourceType: 'oficial_armazem',
      verificationStatus: 'verificado',
      observedDate: dateStr,
      verifiedAt: 'Hoje (Atualizado pelo Armazenista)',
      confidenceScore: 100,
    };
  });

  currentPrices = [...newRecords, ...currentPrices];
}

/**
 * Formata um valor numérico para a moeda de Angola (Kwanza - Kz)
 * Ex: 22500 -> "22.500 Kz"
 */
export function formatKwanza(amount: number): string {
  const rounded = Math.round(amount);
  const formatted = rounded.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `${formatted} Kz`;
}

/**
 * Calcula a comparação completa de preços para um produto e variante
 */
export function compareProductPrices(
  product: Product,
  variantId?: string,
  filterMunicipality?: string
): ProductPriceComparison {
  const selectedVariant = variantId 
    ? (product.variants.find(v => v.id === variantId) || product.variants[0])
    : (product.variants.find(v => v.isDefault) || product.variants[0]);

  // Procura todos os preços registados para esta variante
  const matchingPrices = currentPrices.filter(p => 
    p.productId === product.id && p.variantId === selectedVariant.id
  );

  // Mapeia por loja (ficando apenas com o registo mais recente de cada loja)
  const storePriceMap = new Map<string, PriceRecord>();
  matchingPrices.forEach(record => {
    if (!storePriceMap.has(record.storeId)) {
      storePriceMap.set(record.storeId, record);
    }
  });

  let storesList = STORES.filter(s => storePriceMap.has(s.id));
  if (filterMunicipality && filterMunicipality !== 'todos') {
    storesList = storesList.filter(s => s.municipality === filterMunicipality);
  }

  if (storesList.length === 0) {
    return {
      product,
      selectedVariant,
      comparisons: [],
      lowestPrice: 0,
      highestPrice: 0,
      averagePrice: 0,
      maxSavingsAmount: 0,
      maxSavingsPercent: 0,
      totalStoresCount: 0,
    };
  }

  // Ordena lojas do menor preço para o maior
  const sortedPrices: Array<{ store: Store; record: PriceRecord }> = [];
  storesList.forEach(store => {
    const record = storePriceMap.get(store.id);
    if (record) {
      sortedPrices.push({ store, record });
    }
  });

  sortedPrices.sort((a, b) => a.record.priceAmount - b.record.priceAmount);

  const lowestPrice = sortedPrices[0].record.priceAmount;
  const highestPrice = sortedPrices[sortedPrices.length - 1].record.priceAmount;
  const totalAmount = sortedPrices.reduce((sum, item) => sum + item.record.priceAmount, 0);
  const averagePrice = Math.round(totalAmount / sortedPrices.length);

  const maxSavingsAmount = highestPrice - lowestPrice;
  const maxSavingsPercent = highestPrice > 0 
    ? Math.round((maxSavingsAmount / highestPrice) * 100) 
    : 0;

  const comparisons: PriceComparisonItem[] = sortedPrices.map(item => {
    const diff = item.record.priceAmount - lowestPrice;
    const isLowest = diff === 0;
    const savingsVsHighest = highestPrice > 0 
      ? Math.round(((highestPrice - item.record.priceAmount) / highestPrice) * 100)
      : 0;

    return {
      store: item.store,
      priceRecord: item.record,
      isLowestPrice: isLowest,
      differenceToLowest: diff,
      percentSavingsVsHighest: savingsVsHighest,
      freshnessLabel: item.record.verifiedAt,
      isStale: item.record.verificationStatus === 'desatualizado',
    };
  });

  return {
    product,
    selectedVariant,
    comparisons,
    lowestPrice,
    highestPrice,
    averagePrice,
    maxSavingsAmount,
    maxSavingsPercent,
    totalStoresCount: comparisons.length,
  };
}
