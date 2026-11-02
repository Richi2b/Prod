/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * PREÇO JUSTO ANGOLA — Banner de Estado Offline
 */

import React from 'react';
import { WifiOff } from 'lucide-react';

interface OfflineBannerProps {
  isOnline: boolean;
}

export const OfflineBanner: React.FC<OfflineBannerProps> = ({ isOnline }) => {
  if (isOnline) return null;

  return (
    <div className="bg-amber-600 text-white px-4 py-2.5 text-xs font-semibold flex items-center justify-between shadow-sm sticky top-16 z-20">
      <div className="max-w-6xl mx-auto w-full flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <WifiOff className="w-4 h-4 shrink-0" />
          <span>
            <strong>Modo Offline Ativo:</strong> A consultar preços em cache no teu telemóvel para poupar os teus dados móveis.
          </span>
        </div>
        <span className="text-[10px] bg-amber-700/80 px-2 py-0.5 rounded font-bold uppercase shrink-0">
          Dados Salvos
        </span>
      </div>
    </div>
  );
};
