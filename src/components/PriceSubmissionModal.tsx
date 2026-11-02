/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * PREÇO JUSTO ANGOLA — Modal de Submissão Colaborativa de Preços
 */

import React, { useState } from 'react';
import { X, Camera, CheckCircle, AlertCircle, Sparkles } from 'lucide-react';
import { PRODUCTS, STORES } from '../data/luandaData';
import { PriceRecord } from '../types';
import { addPriceRecord, formatKwanza } from '../services/priceComparisonService';

interface PriceSubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedProductId?: string;
  onSuccess: () => void;
}

export const PriceSubmissionModal: React.FC<PriceSubmissionModalProps> = ({
  isOpen,
  onClose,
  preselectedProductId,
  onSuccess,
}) => {
  const [selectedProductId, setSelectedProductId] = useState<string>(
    preselectedProductId || PRODUCTS[0].id
  );
  const [selectedVariantId, setSelectedVariantId] = useState<string>('');
  const [selectedStoreId, setSelectedStoreId] = useState<string>(STORES[0].id);
  const [priceInput, setPriceInput] = useState<string>('');
  const [observationDate, setObservationDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [userContact, setUserContact] = useState<string>('');
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  if (!isOpen) return null;

  const currentProduct = PRODUCTS.find((p) => p.id === selectedProductId) || PRODUCTS[0];
  const activeVariantId = selectedVariantId || currentProduct.variants[0].id;
  const currentVariant = currentProduct.variants.find((v) => v.id === activeVariantId) || currentProduct.variants[0];

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) {
        setErrorMessage('A imagem deve ter no máximo 4 MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
        setErrorMessage('');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numericPrice = parseFloat(priceInput.replace(/[^0-9]/g, ''));

    if (!numericPrice || numericPrice <= 0) {
      setErrorMessage('Por favor, introduz um valor de preço válido em Kwanzas.');
      return;
    }

    if (numericPrice < 100 || numericPrice > 500000) {
      setErrorMessage('O valor introduzido parece anormal. Por favor confirma o valor em Kwanzas.');
      return;
    }

    const normalizedPrice = currentVariant.packageQuantity > 0 
      ? Number((numericPrice / currentVariant.packageQuantity).toFixed(1))
      : numericPrice;

    const newRecord: PriceRecord = {
      id: `submission_${Date.now()}`,
      productId: currentProduct.id,
      variantId: currentVariant.id,
      storeId: selectedStoreId,
      priceAmount: numericPrice,
      normalizedPrice,
      sourceType: 'contribuicao_comunitaria',
      verificationStatus: 'verificado',
      observedDate: observationDate,
      verifiedAt: 'Hoje (Submetido por consumidor)',
      confidenceScore: photoPreview ? 95 : 85,
      notes: userContact ? `Colaborador: ${userContact}` : undefined,
    };

    addPriceRecord(newRecord);
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onSuccess();
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-5 sm:p-7 shadow-2xl relative border border-slate-100">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors"
          aria-label="Fechar"
        >
          <X className="w-5 h-5" />
        </button>

        {isSuccess ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-extrabold text-slate-900">Preço Submetido com Sucesso!</h2>
            <p className="text-sm text-slate-600 max-w-xs mx-auto">
              Obrigado pela tua contribuição! O novo preço já está disponível para consulta por todas as famílias em Luanda.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                Contribuição Colaborativa
              </span>
              <h2 className="text-xl font-extrabold text-slate-900 mt-1">
                Informar Preço de um Produto
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Viste um preço num armazém ou mercearia? Partilha com a comunidade.
              </p>
            </div>

            {errorMessage && (
              <div className="p-3 bg-red-50 text-red-700 text-xs font-semibold rounded-xl flex items-center gap-2 border border-red-200">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Seleção do Produto */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-800 block">
                Produto
              </label>
              <select
                value={selectedProductId}
                onChange={(e) => {
                  setSelectedProductId(e.target.value);
                  setSelectedVariantId('');
                }}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {PRODUCTS.map((prod) => (
                  <option key={prod.id} value={prod.id}>
                    {prod.name} ({prod.brand})
                  </option>
                ))}
              </select>
            </div>

            {/* Seleção da Embalagem / Variante */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-800 block">
                Tamanho da Embalagem
              </label>
              <div className="grid grid-cols-2 gap-2">
                {currentProduct.variants.map((v) => (
                  <button
                    type="button"
                    key={v.id}
                    onClick={() => setSelectedVariantId(v.id)}
                    className={`min-h-[44px] px-3 py-2 text-xs font-semibold rounded-xl text-left border transition-colors ${
                      activeVariantId === v.id
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {v.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Seleção do Armazém */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-800 block">
                Armazém ou Mercearia
              </label>
              <select
                value={selectedStoreId}
                onChange={(e) => setSelectedStoreId(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {STORES.map((store) => (
                  <option key={store.id} value={store.id}>
                    {store.name} ({store.neighborhood}, {store.municipality})
                  </option>
                ))}
              </select>
            </div>

            {/* Preço em Kwanzas */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-800 block">
                Preço Observado (em Kwanzas)
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={priceInput}
                  onChange={(e) => setPriceInput(e.target.value)}
                  placeholder="Ex: 22500"
                  step="50"
                  className="w-full pl-3 pr-12 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-base font-bold text-slate-900 tabular-nums focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500">
                  Kz
                </span>
              </div>
              {priceInput && parseFloat(priceInput) > 0 && (
                <p className="text-[11px] text-emerald-700 font-medium">
                  Equivalente a: {Math.round(parseFloat(priceInput) / currentVariant.packageQuantity)} {currentVariant.normalizedUnitLabel}
                </p>
              )}
            </div>

            {/* Fotografia opcional da etiqueta */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-800 block">
                Fotografia da Etiqueta ou Recibo (Opcional)
              </label>
              <label className="border-2 border-dashed border-slate-200 hover:border-emerald-400 rounded-2xl p-3 flex flex-col items-center justify-center cursor-pointer transition-colors bg-slate-50/50">
                <Camera className="w-5 h-5 text-slate-400 mb-1" />
                <span className="text-xs font-semibold text-slate-700">
                  {photoPreview ? 'Trocar fotografia anexada' : 'Tirar foto ou anexar da galeria'}
                </span>
                <span className="text-[10px] text-slate-400">Ajuda a certificar a confiança do preço</span>
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </label>

              {photoPreview && (
                <div className="relative mt-2 rounded-xl overflow-hidden max-h-32 border border-slate-200">
                  <img src={photoPreview} alt="Etiqueta pré-visualizada" className="w-full h-32 object-cover" />
                  <button
                    type="button"
                    onClick={() => setPhotoPreview(null)}
                    className="absolute top-1.5 right-1.5 p-1 bg-black/60 text-white rounded-full text-xs"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

            {/* Botão de Submissão */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full min-h-[48px] py-3 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold rounded-xl transition-colors shadow-sm shadow-emerald-600/30 flex items-center justify-center gap-1.5"
              >
                Publicar Preço no Preço Justo
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
