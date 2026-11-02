/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * PREÇO JUSTO ANGOLA — Bottom Navigation Bar Ergonómica
 */

import React from 'react';
import { Search, ShoppingBag, Store, PlusCircle, Briefcase } from 'lucide-react';

export type NavTab = 'comparar' | 'cabaz' | 'armazens' | 'contribuir' | 'comerciante';

interface BottomNavProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  basketCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onTabChange,
  basketCount,
}) => {
  const tabs = [
    {
      id: 'comparar' as NavTab,
      label: 'Comparar',
      icon: Search,
    },
    {
      id: 'cabaz' as NavTab,
      label: 'Cabaz Familiar',
      icon: ShoppingBag,
      badge: basketCount > 0 ? basketCount : undefined,
    },
    {
      id: 'armazens' as NavTab,
      label: 'Armazéns',
      icon: Store,
    },
    {
      id: 'contribuir' as NavTab,
      label: 'Informar Preço',
      icon: PlusCircle,
    },
    {
      id: 'comerciante' as NavTab,
      label: 'Comerciante',
      icon: Briefcase,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200">
      <div className="max-w-md mx-auto grid grid-cols-5 items-center h-16 px-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`relative flex flex-col items-center justify-center min-h-[48px] py-1 transition-colors ${
                isActive ? 'text-emerald-700' : 'text-slate-600 hover:text-slate-800'
              }`}
              aria-label={tab.label}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5px]' : 'stroke-[1.8px]'}`} />
                {tab.badge !== undefined && (
                  <span className="absolute -top-1.5 -right-2 min-w-[16px] h-4 bg-emerald-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className={`text-[10px] mt-1 tracking-tight truncate max-w-[65px] ${isActive ? 'font-bold' : 'font-medium'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
