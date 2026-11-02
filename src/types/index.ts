/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * PREÇO JUSTO ANGOLA — Tipos e Estruturas de Dados Centrais
 */

export type StoreType = 'armazem' | 'mercearia' | 'supermercado' | 'mercado_municipal';

export interface Municipality {
  id: string;
  name: string;
  province: string;
  neighborhoods: string[];
}

export interface Store {
  id: string;
  name: string;
  tradeName: string;
  storeType: StoreType;
  municipality: string;
  neighborhood: string;
  landmark: string;
  address: string;
  phone: string;
  whatsapp?: string;
  isVerified: boolean;
  openingHours: string;
  acceptsMulticaixa: boolean;
  acceptsTransfer: boolean;
  acceptsCash: boolean;
  latitude?: number;
  longitude?: number;
  merchantId?: string;
}

export type UnitOfMeasure = 'kg' | 'g' | 'l' | 'ml' | 'unidade' | 'saco' | 'caixa' | 'cartela';

export interface ProductVariant {
  id: string;
  productId: string;
  name: string; // Ex: "Saco de 25 kg", "Caixa 12x1L", "Garrafa 900 ml"
  packageQuantity: number; // Ex: 25, 12, 0.9, 1
  unit: UnitOfMeasure; // Ex: 'kg', 'l', 'unidade'
  normalizedMultiplier: number; // Multiplicador para calcular Kz/kg ou Kz/L
  normalizedUnitLabel: string; // Ex: "Kz/kg", "Kz/L", "Kz/un"
  barcode?: string;
  isDefault?: boolean;
}

export interface Product {
  id: string;
  name: string; // Ex: "Arroz Agulha Coração", "Óleo Alimentar Sovena"
  brand: string;
  categoryId: string;
  categoryName: string;
  description: string;
  isBasicBasket: boolean; // Cabaz Básico Familiar de Angola
  imageUrl?: string;
  iconName?: string;
  variants: ProductVariant[];
}

export type PriceSourceType = 'oficial_armazem' | 'contribuicao_comunitaria' | 'agente_campo';
export type VerificationStatus = 'verificado' | 'pendente' | 'desatualizado';

export interface PriceRecord {
  id: string;
  productId: string;
  variantId: string;
  storeId: string;
  priceAmount: number; // Preço em Kwanzas (AOA)
  normalizedPrice: number; // Preço por kg ou por litro (Kz/kg ou Kz/L)
  sourceType: PriceSourceType;
  verificationStatus: VerificationStatus;
  observedDate: string; // ISO string ou YYYY-MM-DD
  verifiedAt: string;
  confidenceScore: number; // 0 a 100
  notes?: string;
}

export interface PriceComparisonItem {
  store: Store;
  priceRecord: PriceRecord;
  isLowestPrice: boolean;
  differenceToLowest: number;
  percentSavingsVsHighest: number;
  freshnessLabel: string; // Ex: "Hoje às 08:30", "Há 1 dia", "Há 4 dias"
  isStale: boolean; // Preço com mais de 3 dias
}

export interface ProductPriceComparison {
  product: Product;
  selectedVariant: ProductVariant;
  comparisons: PriceComparisonItem[];
  lowestPrice: number;
  highestPrice: number;
  averagePrice: number;
  maxSavingsAmount: number;
  maxSavingsPercent: number;
  totalStoresCount: number;
}

export interface BasketItem {
  productId: string;
  variantId: string;
  quantity: number;
}

export interface StoreBasketSummary {
  store: Store;
  availableItemsCount: number;
  totalItemsCount: number;
  allAvailable: boolean;
  totalCost: number;
  missingProductNames: string[];
}

export interface BasketCalculationResult {
  items: Array<{
    product: Product;
    variant: ProductVariant;
    quantity: number;
  }>;
  bestSingleStore: StoreBasketSummary | null;
  splitStoreOptimized: {
    totalCost: number;
    savingsVsBestSingle: number;
    breakdown: Array<{
      product: Product;
      variant: ProductVariant;
      quantity: number;
      chosenStore: Store;
      unitPrice: number;
      subtotal: number;
    }>;
  };
  allStoreRankings: StoreBasketSummary[];
}

export interface CommunityPriceSubmission {
  id: string;
  productId: string;
  productName: string;
  variantName: string;
  storeId: string;
  storeName: string;
  priceAmount: number;
  observedDate: string;
  userPhoneOrName: string;
  receiptPhotoUrl?: string;
  status: 'aprovado' | 'pendente' | 'rejeitado';
  submittedAt: string;
}
