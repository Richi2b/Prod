/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * PREÇO JUSTO ANGOLA — Calculadora de Poupança do Cabaz Familiar
 */

import { BasketItem, BasketCalculationResult, StoreBasketSummary, Product, ProductVariant } from '../types';
import { PRODUCTS, STORES } from '../data/luandaData';
import { getAllPrices, formatKwanza } from './priceComparisonService';

export const DEFAULT_BASIC_BASKET: BasketItem[] = [
  { productId: 'prod_arroz_coracao', variantId: 'var_arroz_25kg', quantity: 1 },
  { productId: 'prod_oleo_sovena', variantId: 'var_oleo_cx12', quantity: 1 },
  { productId: 'prod_acucar_doceluanda', variantId: 'var_acucar_25kg', quantity: 1 },
  { productId: 'prod_fuba_milho', variantId: 'var_fuba_25kg', quantity: 1 },
  { productId: 'prod_massa_esparguete', variantId: 'var_massa_cx20', quantity: 1 },
  { productId: 'prod_leite_nido', variantId: 'var_leite_2500g', quantity: 1 },
  { productId: 'prod_ovos_nacionais', variantId: 'var_ovos_cartela30', quantity: 2 },
  { productId: 'prod_sabao_barra', variantId: 'var_sabao_cx10', quantity: 1 },
];

export function calculateFamilyBasketSavings(basketItems: BasketItem[]): BasketCalculationResult {
  const currentPrices = getAllPrices();

  // Resolve os detalhes de cada item do cabaz
  const resolvedItems = basketItems.map(item => {
    const product = PRODUCTS.find(p => p.id === item.productId) as Product;
    const variant = product?.variants.find(v => v.id === item.variantId) as ProductVariant;
    return {
      product,
      variant,
      quantity: item.quantity,
    };
  }).filter(item => item.product && item.variant);

  // Calcula para cada loja quanto custaria o cabaz completo
  const storeSummaries: StoreBasketSummary[] = STORES.map(store => {
    let totalCost = 0;
    let availableCount = 0;
    const missingProducts: string[] = [];

    resolvedItems.forEach(item => {
      // Procura o preço mais recente desta variante nesta loja
      const priceRecord = currentPrices.find(p => 
        p.storeId === store.id && 
        p.productId === item.product.id && 
        p.variantId === item.variant.id
      );

      if (priceRecord) {
        availableCount++;
        totalCost += priceRecord.priceAmount * item.quantity;
      } else {
        missingProducts.push(`${item.product.name} (${item.variant.name})`);
      }
    });

    return {
      store,
      availableItemsCount: availableCount,
      totalItemsCount: resolvedItems.length,
      allAvailable: availableCount === resolvedItems.length,
      totalCost,
      missingProductNames: missingProducts,
    };
  });

  // Filtra as lojas que possuem pelo menos 50% dos itens da cesta e ordena pelo menor custo
  const rankedStores = storeSummaries
    .filter(s => s.availableItemsCount > 0)
    .sort((a, b) => {
      // Prioriza lojas com todos os itens disponíveis
      if (a.allAvailable && !b.allAvailable) return -1;
      if (!a.allAvailable && b.allAvailable) return 1;
      return a.totalCost - b.totalCost;
    });

  const bestSingleStore = rankedStores.length > 0 ? rankedStores[0] : null;

  // Calcula o Cenário Otimizado (comprar cada item individualmente no armazém mais barato de Luanda)
  let splitTotalCost = 0;
  const splitBreakdown = resolvedItems.map(item => {
    // Acha o preço mais barato deste produto em qualquer armazém
    const matchingPrices = currentPrices.filter(p => 
      p.productId === item.product.id && p.variantId === item.variant.id
    );

    if (matchingPrices.length === 0) {
      return {
        product: item.product,
        variant: item.variant,
        quantity: item.quantity,
        chosenStore: STORES[0],
        unitPrice: 0,
        subtotal: 0,
      };
    }

    matchingPrices.sort((a, b) => a.priceAmount - b.priceAmount);
    const cheapestRecord = matchingPrices[0];
    const chosenStore = STORES.find(s => s.id === cheapestRecord.storeId) || STORES[0];
    const subtotal = cheapestRecord.priceAmount * item.quantity;
    splitTotalCost += subtotal;

    return {
      product: item.product,
      variant: item.variant,
      quantity: item.quantity,
      chosenStore,
      unitPrice: cheapestRecord.priceAmount,
      subtotal,
    };
  });

  const savingsVsBestSingle = bestSingleStore && bestSingleStore.allAvailable
    ? Math.max(0, bestSingleStore.totalCost - splitTotalCost)
    : 0;

  return {
    items: resolvedItems,
    bestSingleStore,
    splitStoreOptimized: {
      totalCost: splitTotalCost,
      savingsVsBestSingle,
      breakdown: splitBreakdown,
    },
    allStoreRankings: rankedStores,
  };
}

/**
 * Cria a mensagem pronta para envio ao WhatsApp
 */
export function generateWhatsAppBasketShare(result: BasketCalculationResult): string {
  let message = `🛒 *CABAZ FAMILIAR — PREÇO JUSTO ANGOLA*\n`;
  message += `Poupança estimada nas compras do mês em Luanda\n\n`;

  if (result.bestSingleStore) {
    message += `📍 *Melhor Armazém Único:*\n`;
    message += `🏬 *${result.bestSingleStore.store.name}* (${result.bestSingleStore.store.neighborhood}, ${result.bestSingleStore.store.municipality})\n`;
    message += `💰 *Total Estimado:* ${formatKwanza(result.bestSingleStore.totalCost)}\n`;
    if (result.bestSingleStore.store.whatsapp) {
      message += `📞 WhatsApp da Loja: ${result.bestSingleStore.store.whatsapp}\n`;
    }
    message += `\n`;
  }

  message += `⚡ *Opção de Maior Economia (Compras Divididas):*\n`;
  message += `💰 *Total Mínimo Possível:* ${formatKwanza(result.splitStoreOptimized.totalCost)}\n`;
  if (result.splitStoreOptimized.savingsVsBestSingle > 0) {
    message += `🎉 *Poupança Extra:* ${formatKwanza(result.splitStoreOptimized.savingsVsBestSingle)}\n`;
  }
  message += `\n*Produtos no Cabaz:*\n`;
  result.items.forEach(item => {
    message += `• ${item.quantity}x ${item.product.name} (${item.variant.name})\n`;
  });

  message += `\n_Consulta atualizada no PREÇO JUSTO ANGOLA — Poupa nas compras, compara e escolhe melhor._`;
  return encodeURIComponent(message);
}
