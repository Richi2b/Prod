/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * PREÇO JUSTO ANGOLA — Calculadora de Poupança do Cabaz Familiar
 */

import React, { useState } from 'react';
import { ShoppingBag, Plus, Minus, Trash2, Share2, CheckCircle2, Store, Sparkles, MapPin } from 'lucide-react';
import { BasketItem } from '../types';
import { PRODUCTS } from '../data/luandaData';
import { calculateFamilyBasketSavings, generateWhatsAppBasketShare, DEFAULT_BASIC_BASKET } from '../services/basketCalculatorService';
import { formatKwanza } from '../services/priceComparisonService';

interface FamilyBasketCalculatorViewProps {
  basketItems: BasketItem[];
  onUpdateQuantity: (productId: string, variantId: string, quantity: number) => void;
  onRemoveItem: (productId: string, variantId: string) => void;
  onResetToDefault: () => void;
  onOpenAddProductModal: () => void;
}

export const FamilyBasketCalculatorView: React.FC<FamilyBasketCalculatorViewProps> = ({
  basketItems,
  onUpdateQuantity,
  onRemoveItem,
  onResetToDefault,
  onOpenAddProductModal,
}) => {
  const [copiedToast, setCopiedToast] = useState(false);
  const calculation = calculateFamilyBasketSavings(basketItems);

  const handleShareWhatsApp = () => {
    const encoded = generateWhatsAppBasketShare(calculation);
    window.open(`https://wa.me/?text=${encoded}`, '_blank');
  };

  const handleCopySummary = () => {
    const decoded = decodeURIComponent(generateWhatsAppBasketShare(calculation));
    navigator.clipboard.writeText(decoded).then(() => {
      setCopiedToast(true);
      setTimeout(() => setCopiedToast(false), 2500);
    });
  };

  return (
    <div className="space-y-6 pb-24">
      {/* Top Banner do Cabaz Familiar */}
      <div className="bg-slate-900 text-white rounded-2xl p-5 sm:p-7 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>Simulador de Economia Doméstica</span>
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight mt-1 text-white">
              Cálculo de Poupança do Cabaz Familiar
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-xl">
              Descobre quanto a tua família vai gastar e qual é o armazém de Luanda que oferece o menor total para as compras do mês.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onResetToDefault}
              className="min-h-[44px] px-3 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors border border-slate-700"
            >
              Restaurar Cabaz Típico
            </button>
            <button
              onClick={onOpenAddProductModal}
              className="min-h-[44px] px-3.5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl transition-colors flex items-center gap-1.5 shadow-sm shadow-emerald-600/30"
            >
              <Plus className="w-4 h-4" />
              Adicionar Produto
            </button>
          </div>
        </div>
      </div>

      {/* Cartões de Comparação de Cenários (A vs B) */}
      {calculation.items.length > 0 && calculation.bestSingleStore && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Cenário A: Melhor Armazém Único */}
          <div className="bg-white rounded-2xl p-5 border-2 border-emerald-600/30 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider flex items-center gap-1">
                <Store className="w-3.5 h-3.5" />
                Opção 1 · Menor Custo Num Só Local
              </span>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                Poupa Transporte
              </span>
            </div>

            <h2 className="text-lg font-extrabold text-slate-900 mt-2">
              {calculation.bestSingleStore.store.name}
            </h2>

            <div className="flex items-center gap-1.5 text-xs text-slate-700 mt-1">
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              <span>
                {calculation.bestSingleStore.store.neighborhood}, {calculation.bestSingleStore.store.municipality}
              </span>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-baseline justify-between">
              <div>
                <span className="text-xs text-slate-700 block">Total do Cabaz Completo:</span>
                <span className="text-2xl font-black text-emerald-700 tabular-nums">
                  {formatKwanza(calculation.bestSingleStore.totalCost)}
                </span>
              </div>
              <span className="text-xs text-slate-700 font-medium">
                {calculation.bestSingleStore.availableItemsCount} de {calculation.bestSingleStore.totalItemsCount} produtos disponíveis
              </span>
            </div>

            <p className="text-[11px] text-slate-700 mt-2">
              Recomendado para evitar custos de táxi entre múltiplos mercados e armazéns.
            </p>
          </div>

          {/* Cenário B: Compra Otimizada / Dividida */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-5 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                Opção 2 · Máxima Poupança Teórica
              </span>
              <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                Mais Barato Absoluto
              </span>
            </div>

            <div className="mt-3">
              <span className="text-xs text-slate-300 block">Total Comprando Cada Item no Armazém Mais Barato:</span>
              <span className="text-2xl font-black text-white tabular-nums">
                {formatKwanza(calculation.splitStoreOptimized.totalCost)}
              </span>
            </div>

            <div className="mt-3 pt-3 border-t border-slate-700/60 flex items-center justify-between text-xs">
              <span className="text-emerald-400 font-bold">
                Poupança Extra Potencial:
              </span>
              <span className="text-base font-extrabold text-emerald-300 tabular-nums">
                {calculation.splitStoreOptimized.savingsVsBestSingle > 0 
                  ? `+${formatKwanza(calculation.splitStoreOptimized.savingsVsBestSingle)}` 
                  : 'Preços idênticos'}
              </span>
            </div>

            {/* Ações de Partilha */}
            <div className="mt-4 flex items-center gap-2">
              <button
                onClick={handleShareWhatsApp}
                className="flex-1 min-h-[44px] py-2 px-3 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-sm"
              >
                <Share2 className="w-3.5 h-3.5" />
                Partilhar no WhatsApp
              </button>
              <button
                onClick={handleCopySummary}
                className="min-h-[44px] px-3 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-semibold rounded-xl transition-colors"
                title="Copiar texto formatado"
              >
                {copiedToast ? 'Copiado!' : 'Copiar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lista de Produtos Atuais no Cabaz */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-emerald-600" />
            <h3 className="font-bold text-sm text-slate-900">
              Produtos no Teu Cabaz ({calculation.items.length} itens)
            </h3>
          </div>
          <button
            onClick={onOpenAddProductModal}
            className="text-xs text-emerald-700 font-bold hover:underline flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            Adicionar Outro
          </button>
        </div>

        {calculation.items.length === 0 ? (
          <div className="p-8 text-center text-slate-700 space-y-3">
            <p className="text-sm">O teu cabaz de compras está vazio.</p>
            <button
              onClick={onResetToDefault}
              className="px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl hover:bg-emerald-700"
            >
              Carregar Cabaz Típico de Luanda
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {calculation.items.map((item) => {
              const splitItem = calculation.splitStoreOptimized.breakdown.find(
                b => b.product.id === item.product.id && b.variant.id === item.variant.id
              );

              return (
                <div
                  key={`${item.product.id}_${item.variant.id}`}
                  className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/50"
                >
                  {/* Produto e Embalagem */}
                  <div className="space-y-0.5">
                    <span className="text-[11px] font-semibold text-slate-700">
                      {item.product.categoryName} · {item.product.brand}
                    </span>
                    <h4 className="font-bold text-sm text-slate-900">
                      {item.product.name}
                    </h4>
                    <div className="text-xs text-emerald-800 font-medium">
                      Variante: {item.variant.name}
                      {splitItem && splitItem.unitPrice > 0 && (
                        <span className="text-slate-700 ml-2">
                          (Mais barato: {formatKwanza(splitItem.unitPrice)} no {splitItem.chosenStore.name})
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Controles de Quantidade e Subtotal */}
                  <div className="flex items-center justify-between sm:justify-end gap-4 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                    <div className="flex items-center gap-2 bg-slate-100 rounded-xl p-1">
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, item.variant.id, Math.max(1, item.quantity - 1))}
                        disabled={item.quantity <= 1}
                        className="w-8 h-8 rounded-lg bg-white text-slate-700 flex items-center justify-center font-bold hover:bg-slate-200 disabled:opacity-40 transition-colors"
                        aria-label="Diminuir quantidade"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-8 text-center text-xs font-bold text-slate-900 tabular-nums">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, item.variant.id, item.quantity + 1)}
                        className="w-8 h-8 rounded-lg bg-white text-slate-700 flex items-center justify-center font-bold hover:bg-slate-200 transition-colors"
                        aria-label="Aumentar quantidade"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-right min-w-[90px]">
                      <span className="text-sm font-extrabold text-slate-900 tabular-nums block">
                        {splitItem ? formatKwanza(splitItem.subtotal) : '—'}
                      </span>
                      <span className="text-[10px] text-slate-700">Subtotal est.</span>
                    </div>

                    <button
                      onClick={() => onRemoveItem(item.product.id, item.variant.id)}
                      className="p-2 text-slate-700 hover:text-red-600 rounded-lg transition-colors"
                      title="Remover do cabaz"
                      aria-label="Remover produto do cabaz"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Tabela de Classificação de Todos os Armazéns para este Cabaz */}
      {calculation.allStoreRankings.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100">
            <h3 className="font-bold text-sm text-slate-900">
              Classificação dos Armazéns de Luanda para o Teu Cabaz
            </h3>
            <p className="text-xs text-slate-700 mt-0.5">
              Comparação do custo total caso compres tudo no mesmo estabelecimento
            </p>
          </div>

          <div className="divide-y divide-slate-100">
            {calculation.allStoreRankings.map((ranking, index) => {
              const isFirst = index === 0 && ranking.allAvailable;
              const diffFromBest = calculation.bestSingleStore 
                ? ranking.totalCost - calculation.bestSingleStore.totalCost
                : 0;

              return (
                <div
                  key={ranking.store.id}
                  className={`p-3.5 sm:px-5 flex items-center justify-between gap-3 ${
                    isFirst ? 'bg-emerald-50/50' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-slate-700 w-5">
                      #{index + 1}
                    </span>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                        {ranking.store.name}
                      </h4>
                      <p className="text-[11px] text-slate-700">
                        {ranking.store.neighborhood}, {ranking.store.municipality}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-sm sm:text-base font-extrabold text-slate-900 tabular-nums block">
                      {formatKwanza(ranking.totalCost)}
                    </span>
                    {isFirst ? (
                      <span className="text-[10px] font-bold text-emerald-700">
                        Opção mais barata
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-700">
                        +{formatKwanza(diffFromBest)} mais caro
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
