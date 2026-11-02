/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * PREÇO JUSTO ANGOLA — Aplicação Principal PWA
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { BottomNav, NavTab } from './components/BottomNav';
import { ProductCompareView } from './components/ProductCompareView';
import { FamilyBasketCalculatorView } from './components/FamilyBasketCalculatorView';
import { StoresDirectoryView } from './components/StoresDirectoryView';
import { MerchantPortalView } from './components/MerchantPortalView';
import { PriceSubmissionModal } from './components/PriceSubmissionModal';
import { AddProductToBasketModal } from './components/AddProductToBasketModal';
import { LaravelDocsModal } from './components/LaravelDocsModal';
import { OfflineBanner } from './components/OfflineBanner';
import { BasketItem } from './types';
import { DEFAULT_BASIC_BASKET } from './services/basketCalculatorService';

const BASKET_STORAGE_KEY = 'preco_justo_basket_v1';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('comparar');
  const [selectedMunicipality, setSelectedMunicipality] = useState<string>('todos');
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [isDocsOpen, setIsDocsOpen] = useState<boolean>(false);
  const [isSubmissionModalOpen, setIsSubmissionModalOpen] = useState<boolean>(false);
  const [submissionPreselectedProductId, setSubmissionPreselectedProductId] = useState<string | undefined>();
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState<boolean>(false);
  const [notificationToast, setNotificationToast] = useState<string | null>(null);

  // Inicialização do Cabaz Familiar com persistência no LocalStorage
  const [basketItems, setBasketItems] = useState<BasketItem[]>(() => {
    try {
      const saved = localStorage.getItem(BASKET_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Ignora erro de parsing
    }
    return DEFAULT_BASIC_BASKET;
  });

  // Salva no LocalStorage sempre que o cabaz for alterado
  useEffect(() => {
    try {
      localStorage.setItem(BASKET_STORAGE_KEY, JSON.stringify(basketItems));
    } catch {
      // Ignora se o quota estiver excedido
    }
  }, [basketItems]);

  // Monitorização de conectividade (Online / Offline)
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const showToast = (message: string) => {
    setNotificationToast(message);
    setTimeout(() => {
      setNotificationToast(null);
    }, 2800);
  };

  const handleAddToBasket = (productId: string, variantId: string) => {
    setBasketItems((prev) => {
      const exists = prev.find((i) => i.productId === productId && i.variantId === variantId);
      if (exists) {
        showToast('Item já está presente no teu cabaz familiar.');
        return prev;
      }
      showToast('Produto adicionado ao teu cabaz!');
      return [...prev, { productId, variantId, quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (productId: string, variantId: string, quantity: number) => {
    setBasketItems((prev) =>
      prev.map((item) =>
        item.productId === productId && item.variantId === variantId
          ? { ...item, quantity }
          : item
      )
    );
  };

  const handleRemoveFromBasket = (productId: string, variantId: string) => {
    setBasketItems((prev) =>
      prev.filter((item) => !(item.productId === productId && item.variantId === variantId))
    );
    showToast('Item removido do cabaz.');
  };

  const handleResetToDefault = () => {
    setBasketItems(DEFAULT_BASIC_BASKET);
    showToast('Cabaz restaurado com a cesta básica típica de Luanda.');
  };

  const isItemInBasket = (productId: string, variantId: string) => {
    return basketItems.some((i) => i.productId === productId && i.variantId === variantId);
  };

  const handleTabChange = (tab: NavTab) => {
    if (tab === 'contribuir') {
      setSubmissionPreselectedProductId(undefined);
      setIsSubmissionModalOpen(true);
      return;
    }
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900 font-sans">
      {/* Top Header */}
      <Header
        selectedMunicipality={selectedMunicipality}
        onSelectMunicipality={setSelectedMunicipality}
        onOpenDocs={() => setIsDocsOpen(true)}
        isOnline={isOnline}
      />

      {/* Banner de Estado Offline */}
      <OfflineBanner isOnline={isOnline} />

      {/* Toast Flutuante de Feedback */}
      {notificationToast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-lg animate-fade-in flex items-center gap-2 border border-slate-700">
          <span>{notificationToast}</span>
        </div>
      )}

      {/* Conteúdo Principal da Aba Ativa */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 pt-5">
        {activeTab === 'comparar' && (
          <ProductCompareView
            selectedMunicipality={selectedMunicipality}
            onAddToBasket={handleAddToBasket}
            isItemInBasket={isItemInBasket}
            onOpenSubmission={(prodId) => {
              setSubmissionPreselectedProductId(prodId);
              setIsSubmissionModalOpen(true);
            }}
          />
        )}

        {activeTab === 'cabaz' && (
          <FamilyBasketCalculatorView
            basketItems={basketItems}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveFromBasket}
            onResetToDefault={handleResetToDefault}
            onOpenAddProductModal={() => setIsAddProductModalOpen(true)}
          />
        )}

        {activeTab === 'armazens' && (
          <StoresDirectoryView initialMunicipality={selectedMunicipality} />
        )}

        {activeTab === 'comerciante' && (
          <MerchantPortalView />
        )}
      </main>

      {/* Rodapé Informativo (Clean Unboxed Typography) */}
      <footer className="bg-white border-t border-slate-200 mt-12 mb-16 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-emerald-600 text-white font-bold text-[10px] flex items-center justify-center">
              Kz
            </div>
            <span className="font-bold text-slate-800">PREÇO JUSTO ANGOLA</span>
            <span aria-hidden="true">·</span>
            <span>Poupa nas compras. Compara. Escolhe melhor.</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsDocsOpen(true)}
              className="text-emerald-700 hover:text-emerald-800 font-semibold hover:underline"
            >
              Documentação Laravel & MySQL
            </button>
            <span aria-hidden="true">·</span>
            <span>Luanda, Angola</span>
          </div>
        </div>
      </footer>

      {/* Barra de Navegação Inferior Mobile */}
      <BottomNav
        activeTab={activeTab}
        onTabChange={handleTabChange}
        basketCount={basketItems.length}
      />

      {/* Modais */}
      <PriceSubmissionModal
        isOpen={isSubmissionModalOpen}
        onClose={() => setIsSubmissionModalOpen(false)}
        preselectedProductId={submissionPreselectedProductId}
        onSuccess={() => {
          showToast('Preço publicado com sucesso na base de dados de Luanda!');
        }}
      />

      <AddProductToBasketModal
        isOpen={isAddProductModalOpen}
        onClose={() => setIsAddProductModalOpen(false)}
        onAdd={handleAddToBasket}
        isItemInBasket={isItemInBasket}
      />

      <LaravelDocsModal
        isOpen={isDocsOpen}
        onClose={() => setIsDocsOpen(false)}
      />
    </div>
  );
}
