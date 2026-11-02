/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * PREÇO JUSTO ANGOLA — Diretório de Armazéns e Mercearias de Luanda
 */

import React, { useState, useMemo } from 'react';
import { Store as StoreIcon, MapPin, Phone, MessageCircle, Clock, CreditCard, Search, ShieldCheck } from 'lucide-react';
import { Store, StoreType } from '../types';
import { STORES, MUNICIPALITIES } from '../data/luandaData';

interface StoresDirectoryViewProps {
  initialMunicipality: string;
}

export const StoresDirectoryView: React.FC<StoresDirectoryViewProps> = ({
  initialMunicipality,
}) => {
  const [selectedMunicipality, setSelectedMunicipality] = useState<string>(initialMunicipality);
  const [selectedType, setSelectedType] = useState<string>('todos');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredStores = useMemo(() => {
    return STORES.filter((store) => {
      const matchMun = selectedMunicipality === 'todos' || store.municipality === selectedMunicipality;
      const matchType = selectedType === 'todos' || store.storeType === selectedType;
      const q = searchQuery.toLowerCase().trim();
      const matchSearch = !q ||
        store.name.toLowerCase().includes(q) ||
        store.neighborhood.toLowerCase().includes(q) ||
        store.municipality.toLowerCase().includes(q) ||
        store.landmark.toLowerCase().includes(q);

      return matchMun && matchType && matchSearch;
    });
  }, [selectedMunicipality, selectedType, searchQuery]);

  const typeLabels: Record<StoreType, string> = {
    armazem: 'Armazém de Grosso',
    mercearia: 'Mercearia de Bairro',
    supermercado: 'Supermercado',
    mercado_municipal: 'Mercado Municipal',
  };

  return (
    <div className="space-y-6 pb-24">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-7 shadow-sm">
        <div className="max-w-2xl">
          <span className="text-emerald-700 text-xs font-bold uppercase tracking-wider">
            Rede Comercial de Luanda
          </span>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
            Armazéns e Mercearias Verificados
          </h1>
          <p className="text-slate-600 text-xs sm:text-sm mt-1">
            Encontra armazéns e mercearias nos bairros de Luanda, consulta contactos telefónicos, localização exata e horários de funcionamento.
          </p>
        </div>

        {/* Barra de Pesquisa */}
        <div className="relative mt-4">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Pesquisar por nome do armazém, bairro (Palanca, Estalagem, São Paulo)..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* Filtros de Tipo e Município */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {/* Seletor de Tipo */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setSelectedType('todos')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                selectedType === 'todos' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setSelectedType('armazem')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                selectedType === 'armazem' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
              }`}
            >
              Armazéns
            </button>
            <button
              onClick={() => setSelectedType('mercearia')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                selectedType === 'mercearia' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
              }`}
            >
              Mercearias
            </button>
          </div>

          {/* Seletor de Município */}
          <select
            value={selectedMunicipality}
            onChange={(e) => setSelectedMunicipality(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none cursor-pointer"
          >
            <option value="todos">Todos os Municípios de Luanda</option>
            {MUNICIPALITIES.map((mun) => (
              <option key={mun.id} value={mun.name}>
                {mun.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Lista de Estabelecimentos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredStores.map((store) => (
          <div
            key={store.id}
            className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm space-y-4 hover:border-slate-300 transition-colors"
          >
            {/* Cabeçalho */}
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  {typeLabels[store.storeType]}
                </span>
                {store.isVerified && (
                  <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Verificado
                  </span>
                )}
              </div>
              <h2 className="text-base font-extrabold text-slate-900 mt-1">
                {store.name}
              </h2>
              <p className="text-xs text-slate-500 italic">
                {store.tradeName}
              </p>
            </div>

            {/* Localização e Referência */}
            <div className="space-y-1.5 text-xs text-slate-600 border-t border-slate-100 pt-3">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900">{store.neighborhood}, {store.municipality}</strong>
                  <p className="text-slate-500 text-[11px]">{store.landmark}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1 text-[11px] text-slate-500">
                <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{store.openingHours}</span>
              </div>
            </div>

            {/* Pagamentos Aceites */}
            <div className="flex items-center gap-2 text-[11px] text-slate-600 border-t border-slate-100 pt-2.5">
              <CreditCard className="w-3.5 h-3.5 text-slate-400" />
              <span>
                {store.acceptsMulticaixa ? 'Multicaixa Ativo · ' : ''}
                {store.acceptsTransfer ? 'Transferência Bancária · ' : ''}
                Dinheiro
              </span>
            </div>

            {/* Ações de Contacto */}
            <div className="pt-2 flex items-center gap-2">
              {store.whatsapp && (
                <a
                  href={`https://wa.me/${store.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                    `Olá! Encontrei o vosso armazém no Preço Justo Angola. Gostaria de confirmar cotações de preços de hoje.`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 min-h-[44px] py-2 px-3 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-sm shadow-emerald-600/20"
                >
                  <MessageCircle className="w-4 h-4" />
                  Conversar no WhatsApp
                </a>
              )}
              <a
                href={`tel:${store.phone}`}
                className="min-h-[44px] px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5"
              >
                <Phone className="w-4 h-4" />
                Ligar
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
