/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * PREÇO JUSTO ANGOLA — Modal de Adição de Produtos ao Cabaz Familiar
 */

import React, { useState } from 'react';
import { X, Search, Plus, Check } from 'lucide-react';
import { PRODUCTS } from '../data/luandaData';

interface AddProductToBasketModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (productId: string, variantId: string) => void;
  isItemInBasket: (productId: string, variantId: string) => boolean;
}

export const AddProductToBasketModal: React.FC<AddProductToBasketModalProps> = ({
  isOpen,
  onClose,
  onAdd,
  isItemInBasket,
}) => {
  const [search, setSearch] = useState('');

  if (!isOpen) return null;

  const filtered = PRODUCTS.filter((p) => {
    const q = search.toLowerCase().trim();
    return !q || p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q) || p.categoryName.toLowerCase().includes(q);
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[85vh] overflow-y-auto p-5 sm:p-6 shadow-2xl relative border border-slate-100 flex flex-col">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900">
              Adicionar ao Cabaz Familiar
            </h2>
            <p className="text-xs text-slate-500">
              Escolhe os produtos e variantes que consomes mensalmente
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Campo de Pesquisa */}
        <div className="relative my-3">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Pesquisar feijão, sal, ovos, sabão..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* Lista de Produtos com Variantes */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 pr-1">
          {filtered.map((prod) => (
            <div key={prod.id} className="py-3 space-y-2">
              <div>
                <span className="text-[10px] font-semibold text-slate-500">
                  {prod.categoryName} · {prod.brand}
                </span>
                <h4 className="text-xs font-bold text-slate-900">{prod.name}</h4>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {prod.variants.map((v) => {
                  const inBasket = isItemInBasket(prod.id, v.id);
                  return (
                    <button
                      key={v.id}
                      onClick={() => onAdd(prod.id, v.id)}
                      className={`min-h-[44px] px-3 py-1.5 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors ${
                        inBasket
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                          : 'bg-slate-50 text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 border border-slate-200'
                      }`}
                    >
                      {inBasket ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{v.name} (Adicionado)</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5" />
                          <span>{v.name}</span>
                        </>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="pt-3 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="min-h-[44px] px-5 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800"
          >
            Concluir Seleção
          </button>
        </div>
      </div>
    </div>
  );
};
