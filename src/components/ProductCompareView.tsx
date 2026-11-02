/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * PREÇO JUSTO ANGOLA — Comparador de Preços e Catálogo
 */

import React, { useState, useMemo } from 'react';
import { Search, ArrowUpDown, Phone, MessageCircle, Plus, Check, Clock, ShieldCheck, MapPin } from 'lucide-react';
import { Product, ProductVariant } from '../types';
import { PRODUCTS } from '../data/luandaData';
import { compareProductPrices, formatKwanza } from '../services/priceComparisonService';

interface ProductCompareViewProps {
  selectedMunicipality: string;
  onAddToBasket: (productId: string, variantId: string) => void;
  isItemInBasket: (productId: string, variantId: string) => boolean;
  onOpenSubmission: (productId?: string) => void;
}

export const ProductCompareView: React.FC<ProductCompareViewProps> = ({
  selectedMunicipality,
  onAddToBasket,
  isItemInBasket,
  onOpenSubmission,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [activeVariantMap, setActiveVariantMap] = useState<Record<string, string>>({});
  const [expandedProductMap, setExpandedProductMap] = useState<Record<string, boolean>>({});

  // Categorias únicas
  const categories = useMemo(() => [
    { id: 'todos', label: 'Todos os Produtos' },
    { id: 'cesta_basica', label: 'Cesta Básica Familiar' },
    { id: 'lacticinios', label: 'Lacticínios & Ovos' },
    { id: 'higiene_limpeza', label: 'Higiene & Limpeza' },
  ], []);

  // Filtro de produtos
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((product) => {
      const matchesCategory = selectedCategory === 'todos' || product.categoryId === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || 
        product.name.toLowerCase().includes(q) ||
        product.brand.toLowerCase().includes(q) ||
        product.categoryName.toLowerCase().includes(q) ||
        product.description.toLowerCase().includes(q);

      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  const handleSelectVariant = (productId: string, variantId: string) => {
    setActiveVariantMap(prev => ({ ...prev, [productId]: variantId }));
  };

  const toggleExpand = (productId: string) => {
    setExpandedProductMap(prev => ({ ...prev, [productId]: !prev[productId] }));
  };

  return (
    <div className="space-y-6 pb-24">
      {/* Hero Banner do Consumidor */}
      <div className="bg-gradient-to-br from-emerald-700 via-emerald-800 to-slate-900 text-white rounded-2xl p-5 sm:p-7 shadow-sm">
        <div className="max-w-xl">
          <span className="text-emerald-200 text-xs font-bold tracking-wider uppercase">Mercado de Luanda</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1 text-white">
            Poupa dinheiro nas tuas compras do mês.
          </h1>
          <p className="text-emerald-100/90 text-sm mt-2 leading-relaxed">
            Compara preços reais de arroz, óleo, açúcar, fuba e ovos nos armazéns e mercearias de Viana, São Paulo, Palanca, Kikolo e Cazenga.
          </p>
        </div>

        {/* Campo de Pesquisa em Destaque */}
        <div className="relative mt-5">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Pesquisar arroz 25kg, óleo Sovena, fuba, leite..."
            className="w-full pl-10 pr-4 py-3 bg-white text-slate-900 rounded-xl text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 placeholder:text-slate-400"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-500 hover:text-slate-800 px-2 py-1"
            >
              Limpar
            </button>
          )}
        </div>
      </div>

      {/* Barra de Filtro de Categorias (Controles Funcionais Segmentados) */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-2 text-xs font-semibold rounded-xl whitespace-nowrap transition-colors shrink-0 ${
                isSelected
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Cabeçalho de Resultados e Município selecionado */}
      <div className="flex items-center justify-between text-xs text-slate-700 px-1">
        <span>
          Mostrando <strong className="text-slate-900">{filteredProducts.length}</strong> produtos
          {selectedMunicipality !== 'todos' && ` em ${selectedMunicipality}`}
        </span>
        <button
          onClick={() => onOpenSubmission()}
          className="text-emerald-800 hover:text-emerald-950 font-bold flex items-center gap-1 hover:underline"
        >
          <Plus className="w-3.5 h-3.5" />
          Informar novo preço
        </button>
      </div>

      {/* Lista de Produtos com Comparação Ativa */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-3">
          <p className="text-slate-700 font-semibold text-sm">Nenhum produto encontrado para "{searchQuery}".</p>
          <p className="text-slate-700 text-xs">Podes informar o preço de um produto observado num armazém para ajudar outras famílias.</p>
          <button
            onClick={() => onOpenSubmission()}
            className="px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl hover:bg-emerald-700"
          >
            Cadastrar Preço deste Produto
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredProducts.map((product) => {
            const currentVariantId = activeVariantMap[product.id] || product.variants.find(v => v.isDefault)?.id || product.variants[0].id;
            const comparison = compareProductPrices(product, currentVariantId, selectedMunicipality);
            const isExpanded = expandedProductMap[product.id] ?? true; // Expandido por defeito para consulta rápida
            const selectedVariant = comparison.selectedVariant;
            const inBasket = isItemInBasket(product.id, selectedVariant.id);

            return (
              <div
                key={product.id}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden transition-shadow hover:shadow-md"
              >
                {/* Cabeçalho do Cartão de Produto */}
                <div className="p-4 sm:p-5">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    {/* Título e Metadados Limpos (Sem pílulas decorativas) */}
                    <div>
                      <div className="flex items-center gap-2 text-xs text-slate-700 mb-1">
                        <span className="font-semibold text-slate-700">{product.categoryName}</span>
                        <span aria-hidden="true">·</span>
                        <span>Marca: {product.brand}</span>
                        {product.isBasicBasket && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span className="text-emerald-800 font-semibold">Cabaz Básico</span>
                          </>
                        )}
                      </div>
                      <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                        {product.name}
                      </h2>
                      <p className="text-xs text-slate-700 mt-1 line-clamp-1">
                        {product.description}
                      </p>
                    </div>

                    {/* Botão de Adicionar ao Cabaz */}
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => onAddToBasket(product.id, selectedVariant.id)}
                        className={`min-h-[44px] px-3.5 py-2 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 ${
                          inBasket
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                            : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm shadow-emerald-600/20'
                        }`}
                      >
                        {inBasket ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            No Cabaz
                          </>
                        ) : (
                          <>
                            <Plus className="w-3.5 h-3.5" />
                            Adicionar ao Cabaz
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Seletor de Variantes (Ex: Saco 25kg, Saco 5kg, Pacote 1kg) */}
                  {product.variants.length > 1 && (
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2 overflow-x-auto no-scrollbar">
                      <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider shrink-0">
                        Embalagem:
                      </span>
                      {product.variants.map((v) => {
                        const isCurrent = v.id === selectedVariant.id;
                        return (
                          <button
                            key={v.id}
                            onClick={() => handleSelectVariant(product.id, v.id)}
                            className={`min-h-[44px] px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors shrink-0 ${
                              isCurrent
                                ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                                : 'bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            {v.name}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* Resumo Instantâneo de Poupança */}
                  {comparison.comparisons.length > 0 ? (
                    <div className="mt-4 p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 grid grid-cols-2 sm:grid-cols-4 gap-3 items-center">
                      <div>
                        <span className="text-[11px] text-slate-700 font-medium block">Menor Preço</span>
                        <span className="text-base sm:text-lg font-extrabold text-emerald-700 tabular-nums">
                          {formatKwanza(comparison.lowestPrice)}
                        </span>
                        <span className="text-[10px] text-slate-700 block">
                          {Math.round(comparison.lowestPrice / selectedVariant.packageQuantity)} {selectedVariant.normalizedUnitLabel}
                        </span>
                      </div>

                      <div>
                        <span className="text-[11px] text-slate-700 font-medium block">Preço Mais Alto</span>
                        <span className="text-sm sm:text-base font-bold text-slate-700 tabular-nums line-through">
                          {formatKwanza(comparison.highestPrice)}
                        </span>
                        <span className="text-[10px] text-slate-700 block">Em grandes superfícies</span>
                      </div>

                      <div>
                        <span className="text-[11px] text-slate-700 font-medium block">Poupança Máxima</span>
                        <span className="text-sm sm:text-base font-bold text-emerald-700 tabular-nums">
                          {formatKwanza(comparison.maxSavingsAmount)}
                        </span>
                        <span className="text-[10px] text-emerald-700 font-semibold block">
                          {comparison.maxSavingsPercent}% de diferença
                        </span>
                      </div>

                      <div>
                        <span className="text-[11px] text-slate-700 font-medium block">Armazéns em Luanda</span>
                        <span className="text-xs font-bold text-slate-800">
                          {comparison.totalStoresCount} locais comparados
                        </span>
                        <button
                          onClick={() => toggleExpand(product.id)}
                          className="text-[11px] text-emerald-800 hover:underline font-semibold block mt-0.5"
                        >
                          {isExpanded ? 'Ocultar tabela ▲' : 'Ver todos os armazéns ▼'}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-3 p-3 bg-amber-50 rounded-xl text-xs text-amber-800 border border-amber-200">
                      Sem preços registados para esta embalagem no município selecionado.
                    </div>
                  )}
                </div>

                {/* Tabela Comparativa Detalhada por Armazém */}
                {isExpanded && comparison.comparisons.length > 0 && (
                  <div className="border-t border-slate-100 bg-white">
                    <div className="px-4 py-2 bg-slate-100/60 text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center justify-between">
                      <span>Armazém / Mercearia em Luanda</span>
                      <span>Preço & Poupança</span>
                    </div>

                    <div className="divide-y divide-slate-100">
                      {comparison.comparisons.map((item, index) => {
                        return (
                          <div
                            key={item.store.id}
                            className={`p-3.5 sm:px-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                              item.isLowestPrice ? 'bg-emerald-50/40' : 'hover:bg-slate-50/50'
                            }`}
                          >
                            {/* Dados do Armazém */}
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-slate-500 tabular-nums">
                                  #{index + 1}
                                </span>
                                <h3 className="text-sm font-bold text-slate-900">
                                  {item.store.name}
                                </h3>
                                {item.isLowestPrice && (
                                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2 py-0.5 rounded-md">
                                    Mais Barato
                                  </span>
                                )}
                              </div>

                              <div className="flex items-center gap-2 text-xs text-slate-700">
                                <span className="flex items-center gap-1 font-medium text-slate-700">
                                  <MapPin className="w-3 h-3 text-emerald-600" />
                                  {item.store.neighborhood}, {item.store.municipality}
                                </span>
                                <span aria-hidden="true">·</span>
                                <span className="flex items-center gap-1 text-slate-700">
                                  <Clock className="w-3 h-3 text-slate-700" />
                                  {item.freshnessLabel}
                                </span>
                              </div>

                              <p className="text-[11px] text-slate-700 italic">
                                {item.store.landmark}
                              </p>
                            </div>

                            {/* Preço e Botões de Ação */}
                            <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                              <div className="text-right">
                                <span className="text-base sm:text-lg font-black text-slate-900 tabular-nums block">
                                  {formatKwanza(item.priceRecord.priceAmount)}
                                </span>
                                {item.isLowestPrice ? (
                                  <span className="text-[11px] text-emerald-700 font-bold block">
                                    Melhor cotação
                                  </span>
                                ) : (
                                  <span className="text-[11px] text-slate-700 block">
                                    +{formatKwanza(item.differenceToLowest)} vs menor
                                  </span>
                                )}
                              </div>

                              {/* Ações de Contacto com o Armazém */}
                              <div className="flex items-center gap-1.5">
                                {item.store.whatsapp && (
                                  <a
                                    href={`https://wa.me/${item.store.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                                      `Olá! Vi no Preço Justo que o ${product.name} (${selectedVariant.name}) está a ${formatKwanza(item.priceRecord.priceAmount)}. Ainda têm disponível no vosso armazém?`
                                    )}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="min-h-[44px] min-w-[44px] flex items-center justify-center bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-xl transition-colors"
                                    title="Enviar mensagem WhatsApp ao Armazém"
                                    aria-label="WhatsApp da Loja"
                                  >
                                    <MessageCircle className="w-4 h-4" />
                                  </a>
                                )}
                                <a
                                  href={`tel:${item.store.phone}`}
                                  className="min-h-[44px] min-w-[44px] flex items-center justify-center bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-xl transition-colors"
                                  title="Ligar para o Armazém"
                                  aria-label="Ligar para a Loja"
                                >
                                  <Phone className="w-4 h-4" />
                                </a>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
