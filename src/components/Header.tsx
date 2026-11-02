/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * PREÇO JUSTO ANGOLA — Top Navigation Bar
 */

import React from 'react';
import { MapPin, FileCode, Wifi, WifiOff } from 'lucide-react';
import { MUNICIPALITIES } from '../data/luandaData';

interface HeaderProps {
  selectedMunicipality: string;
  onSelectMunicipality: (municipalityId: string) => void;
  onOpenDocs: () => void;
  isOnline: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  selectedMunicipality,
  onSelectMunicipality,
  onOpenDocs,
  isOnline,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand Zone */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-sm shadow-emerald-600/20 font-bold text-lg">
            Kz
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-extrabold text-lg tracking-tight text-slate-900">PREÇO JUSTO</span>
              <span className="text-[11px] font-semibold text-emerald-700 tracking-wider">ANGOLA</span>
            </div>
            <p className="text-[11px] text-slate-700 hidden sm:block">Comparador de preços de Luanda</p>
          </div>
        </div>

        {/* Center / Location Selector Zone */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-slate-100/90 rounded-lg px-2.5 py-1.5 border border-slate-200 text-xs font-medium text-slate-700">
            <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <select
              value={selectedMunicipality}
              onChange={(e) => onSelectMunicipality(e.target.value)}
              className="bg-transparent border-none text-xs font-semibold text-slate-800 focus:outline-none cursor-pointer pr-1"
              aria-label="Selecionar Município de Luanda"
            >
              <option value="todos">Toda a Província de Luanda</option>
              {MUNICIPALITIES.map((mun) => (
                <option key={mun.id} value={mun.name}>
                  {mun.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Right Zone / Actions */}
        <div className="flex items-center gap-2">
          {/* Online/Offline status icon */}
          <div 
            title={isOnline ? 'Ligado à rede' : 'Modo Offline (dados em cache)'} 
            className="flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium text-slate-600"
          >
            {isOnline ? (
              <span className="flex items-center gap-1 text-emerald-700">
                <Wifi className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Online</span>
              </span>
            ) : (
              <span className="flex items-center gap-1 text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">
                <WifiOff className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Offline</span>
              </span>
            )}
          </div>

          {/* Technical Docs trigger */}
          <button
            onClick={onOpenDocs}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors border border-emerald-200/60"
            title="Ver Arquitetura Técnica Laravel & MySQL"
          >
            <FileCode className="w-3.5 h-3.5 text-emerald-700" />
            <span className="hidden sm:inline">Arquitetura Laravel</span>
          </button>
        </div>
      </div>
    </header>
  );
};
