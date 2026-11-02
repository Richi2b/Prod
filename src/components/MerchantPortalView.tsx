/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * PREÇO JUSTO ANGOLA — Painel do Armazenista e Comerciante
 */

import React, { useState } from 'react';
import { Briefcase, CheckCircle2, TrendingUp, Users, MessageCircle, RefreshCw, Save, ShieldCheck } from 'lucide-react';
import { STORES, PRODUCTS } from '../data/luandaData';
import { getAllPrices, updatePricesBulk, formatKwanza } from '../services/priceComparisonService';

export const MerchantPortalView: React.FC = () => {
  const [selectedStoreId, setSelectedStoreId] = useState<string>(STORES[0].id);
  const [pricesState, setPricesState] = useState<Record<string, number>>({});
  const [saveSuccessToast, setSaveSuccessToast] = useState(false);

  const currentStore = STORES.find((s) => s.id === selectedStoreId) || STORES[0];
  const allPrices = getAllPrices();

  // Inicializa os preços atuais para a loja selecionada
  React.useEffect(() => {
    const initialMap: Record<string, number> = {};
    PRODUCTS.forEach((prod) => {
      const defaultVar = prod.variants.find((v) => v.isDefault) || prod.variants[0];
      const match = allPrices.find(
        (p) => p.storeId === currentStore.id && p.productId === prod.id && p.variantId === defaultVar.id
      );
      if (match) {
        initialMap[`${prod.id}_${defaultVar.id}`] = match.priceAmount;
      }
    });
    setPricesState(initialMap);
  }, [selectedStoreId]);

  const handlePriceChange = (key: string, value: string) => {
    const numeric = parseFloat(value.replace(/[^0-9]/g, '')) || 0;
    setPricesState((prev) => ({ ...prev, [key]: numeric }));
  };

  const handleSaveAll = (e: React.FormEvent) => {
    e.preventDefault();
    const updates: Array<{ productId: string; variantId: string; newPrice: number }> = [];

    Object.entries(pricesState).forEach(([key, price]) => {
      const [productId, variantId] = key.split('_');
      if (price > 0) {
        updates.push({ productId, variantId, newPrice: price });
      }
    });

    updatePricesBulk(currentStore.id, updates);
    setSaveSuccessToast(true);
    setTimeout(() => setSaveSuccessToast(false), 3000);
  };

  return (
    <div className="space-y-6 pb-24">
      {/* Banner Principal do Comerciante */}
      <div className="bg-gradient-to-r from-slate-900 to-emerald-950 text-white rounded-2xl p-5 sm:p-7 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
              <Briefcase className="w-4 h-4" />
              <span>Área Comercial de Luanda</span>
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight mt-1 text-white">
              Painel do Armazenista & Mercearia
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-xl">
              Atualiza os preços do teu armazém em menos de 1 minuto e ganha o selo de verificação do dia para os compradores do teu município.
            </p>
          </div>

          {/* Seletor de Loja */}
          <div className="bg-slate-800/90 border border-slate-700 p-2 rounded-xl text-left">
            <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">
              A gerir estabelecimento:
            </span>
            <select
              value={selectedStoreId}
              onChange={(e) => setSelectedStoreId(e.target.value)}
              className="bg-slate-900 text-white text-xs font-bold px-2 py-1.5 rounded-lg border border-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
            >
              {STORES.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.neighborhood})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Estatísticas de Desempenho do Armazém */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold">
            <Users className="w-3.5 h-3.5 text-emerald-600" />
            <span>Consultas da Loja</span>
          </div>
          <span className="text-xl sm:text-2xl font-black text-slate-900 mt-2 block tabular-nums">
            3.420
          </span>
          <span className="text-[10px] text-emerald-700 font-semibold">+18% esta semana</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold">
            <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
            <span>Cliques WhatsApp</span>
          </div>
          <span className="text-xl sm:text-2xl font-black text-slate-900 mt-2 block tabular-nums">
            418
          </span>
          <span className="text-[10px] text-slate-500">Contactos diretos</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
            <span>Menor Preço</span>
          </div>
          <span className="text-xl sm:text-2xl font-black text-emerald-600 mt-2 block tabular-nums">
            4 Produtos
          </span>
          <span className="text-[10px] text-emerald-700 font-semibold">Líder em Viana</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Estado da Conta</span>
          </div>
          <span className="text-xs font-bold text-slate-900 mt-2 block">
            Plano Pro Luanda
          </span>
          <span className="text-[10px] text-emerald-700 font-semibold">Selo Oficial Ativo</span>
        </div>
      </div>

      {/* Formulário de Atualização Expressa de Preços */}
      <form onSubmit={handleSaveAll} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-extrabold text-slate-900">
              Atualização Expressa de Preços de Hoje
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Altera diretamente os valores dos sacos, caixas e fardos comercializados em {currentStore.name}.
            </p>
          </div>

          <button
            type="submit"
            className="min-h-[44px] px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm shadow-emerald-600/30 shrink-0"
          >
            <Save className="w-4 h-4" />
            Publicar Preços de Hoje
          </button>
        </div>

        {saveSuccessToast && (
          <div className="m-4 p-3.5 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold rounded-xl flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Preços do armazém atualizados com sucesso e publicados no comparador de Luanda!</span>
          </div>
        )}

        <div className="divide-y divide-slate-100">
          {PRODUCTS.map((prod) => {
            const defaultVar = prod.variants.find((v) => v.isDefault) || prod.variants[0];
            const key = `${prod.id}_${defaultVar.id}`;
            const currentVal = pricesState[key] || 0;

            return (
              <div
                key={key}
                className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/50"
              >
                <div>
                  <span className="text-[11px] font-semibold text-slate-500">
                    {prod.categoryName} · {prod.brand}
                  </span>
                  <h3 className="font-bold text-sm text-slate-900">
                    {prod.name}
                  </h3>
                  <p className="text-xs text-emerald-700 font-medium">
                    Embalagem: {defaultVar.name}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="relative w-44">
                    <input
                      type="number"
                      value={currentVal || ''}
                      onChange={(e) => handlePriceChange(key, e.target.value)}
                      placeholder="Preço em Kz"
                      className="w-full pl-3 pr-10 py-2 text-sm font-black text-slate-900 tabular-nums bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-right"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                      Kz
                    </span>
                  </div>

                  {currentVal > 0 && (
                    <span className="text-[11px] text-slate-500 min-w-[70px] text-right tabular-nums">
                      {Math.round(currentVal / defaultVar.packageQuantity)} {defaultVar.normalizedUnitLabel}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            A publicar como: <strong>{currentStore.tradeName}</strong>
          </span>
          <button
            type="submit"
            className="min-h-[44px] px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-2 shadow-sm"
          >
            <CheckCircle2 className="w-4 h-4" />
            Guardar & Atualizar
          </button>
        </div>
      </form>
    </div>
  );
};
