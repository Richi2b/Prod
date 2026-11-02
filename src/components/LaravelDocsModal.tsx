/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * PREÇO JUSTO ANGOLA — Visualizador da Especificação Técnica Laravel & MySQL
 */

import React, { useState } from 'react';
import { X, FileCode, Database, Terminal, Shield, Copy, Check } from 'lucide-react';

interface LaravelDocsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LaravelDocsModal: React.FC<LaravelDocsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'arquitetura' | 'mysql' | 'services' | 'deploy'>('arquitetura');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col border border-slate-200">
        {/* Header do Modal */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-900 text-white">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-red-600/90 text-white flex items-center justify-center font-bold text-sm">
              L
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white">
                  Especificação Técnica Laravel 11/12 & MySQL 8
                </h2>
                <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/30">
                  PHP 8.3+
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Monólito Modular Orientado ao Domínio para o PREÇO JUSTO ANGOLA
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-colors"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Abas de Navegação */}
        <div className="flex items-center gap-1 p-2 bg-slate-100 border-b border-slate-200 overflow-x-auto no-scrollbar text-xs font-semibold">
          <button
            onClick={() => setActiveTab('arquitetura')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 whitespace-nowrap transition-colors ${
              activeTab === 'arquitetura' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            1. Arquitetura Modular
          </button>
          <button
            onClick={() => setActiveTab('mysql')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 whitespace-nowrap transition-colors ${
              activeTab === 'mysql' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            2. Schema MySQL 8 & Migrations
          </button>
          <button
            onClick={() => setActiveTab('services')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 whitespace-nowrap transition-colors ${
              activeTab === 'services' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            3. Services & Eloquent Models
          </button>
          <button
            onClick={() => setActiveTab('deploy')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 whitespace-nowrap transition-colors ${
              activeTab === 'deploy' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            4. Execução & Deploy em Angola
          </button>
        </div>

        {/* Conteúdo das Abas */}
        <div className="flex-1 overflow-y-auto p-5 font-mono text-xs text-slate-800 bg-slate-50/50 space-y-4">
          {activeTab === 'arquitetura' && (
            <div className="space-y-4 text-slate-800 font-sans">
              <div className="p-4 bg-white rounded-xl border border-slate-200">
                <h3 className="font-bold text-sm text-slate-900 mb-2">Estrutura de Pastas Idiomática Laravel 11/12</h3>
                <pre className="bg-slate-900 text-slate-100 p-4 rounded-xl text-xs overflow-x-auto leading-relaxed">
{`app/
├── Enums/
│   ├── PriceSourceType.php       // OFFICIAL_MERCHANT, CROWDSOURCING, SCRAPED
│   ├── VerificationStatus.php    // VERIFIED, PENDING, EXPIRED
│   └── StoreType.php             // WAREHOUSE, GROCERY, SUPERMARKET
├── Http/
│   ├── Controllers/
│   │   ├── Api/
│   │   │   └── PriceComparisonApiController.php
│   │   └── Web/
│   │       ├── HomeController.php
│   │       ├── ProductController.php
│   │       └── BasketCalculatorController.php
│   └── Requests/
│       ├── StorePriceSubmissionRequest.php
│       └── BulkPriceUpdateRequest.php
├── Models/
│   ├── Store.php
│   ├── Product.php
│   ├── ProductVariant.php
│   ├── Price.php                 // Histórico imutável de preços
│   └── PriceSubmission.php
├── Services/
│   ├── PriceComparisonService.php
│   ├── BasketSavingsCalculator.php
│   └── UnitNormalizationService.php
└── Policies/
    └── StorePolicy.php           // Isolamento de dados entre armazenistas`}
                </pre>
              </div>

              <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-2">
                <h4 className="font-bold text-slate-900 text-xs">Padrão Price Ledger (Imutabilidade de Preços):</h4>
                <p className="text-xs text-slate-600">
                  Cada nova alteração de preço submetida pelo comerciante ou registada por agente de campo cria uma linha na tabela <code className="bg-slate-100 px-1 py-0.5 rounded font-mono">prices</code> sem sobrescrever o passado. Isto garante rastreabilidade temporal, cálculo de inflação e proteção contra adulterações.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'mysql' && (
            <div className="space-y-3 font-sans">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">Código SQL das Migrações (MySQL 8 Strict Mode):</span>
                <button
                  onClick={() => copyToClipboard(`-- PREÇO JUSTO ANGOLA MySQL 8 Schema
CREATE TABLE provinces (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE municipalities (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    province_id INT UNSIGNED NOT NULL,
    name VARCHAR(120) NOT NULL,
    CONSTRAINT fk_mun_province FOREIGN KEY (province_id) REFERENCES provinces(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE stores (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    municipality_id INT UNSIGNED NOT NULL,
    name VARCHAR(180) NOT NULL,
    trade_name VARCHAR(180) NULL,
    store_type ENUM('armazem', 'mercearia', 'supermercado', 'mercado_municipal') NOT NULL,
    neighborhood VARCHAR(120) NOT NULL,
    landmark VARCHAR(255) NULL,
    phone VARCHAR(30) NOT NULL,
    whatsapp VARCHAR(30) NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    INDEX idx_stores_location (municipality_id, neighborhood),
    CONSTRAINT fk_store_mun FOREIGN KEY (municipality_id) REFERENCES municipalities(id)
) ENGINE=InnoDB;

CREATE TABLE prices (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    store_id BIGINT UNSIGNED NOT NULL,
    product_variant_id BIGINT UNSIGNED NOT NULL,
    price_amount DECIMAL(12,2) NOT NULL,
    normalized_price_per_unit DECIMAL(12,4) NOT NULL,
    source_type ENUM('oficial_armazem', 'contribuicao_comunitaria', 'agente_campo') NOT NULL,
    verification_status ENUM('verificado', 'pendente', 'desatualizado') DEFAULT 'verificado',
    observed_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_prices_lookup (product_variant_id, store_id, created_at DESC),
    INDEX idx_prices_amount (product_variant_id, price_amount ASC)
) ENGINE=InnoDB;`)}
                  className="px-2.5 py-1 bg-slate-900 text-white text-xs font-semibold rounded-lg flex items-center gap-1 hover:bg-slate-800"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copiado' : 'Copiar SQL'}
                </button>
              </div>

              <pre className="bg-slate-900 text-slate-100 p-4 rounded-xl text-xs font-mono overflow-x-auto leading-relaxed max-h-96">
{`-- PREÇO JUSTO ANGOLA — Schema MySQL 8 DDL Oficial
CREATE TABLE provinces (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE municipalities (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    province_id INT UNSIGNED NOT NULL,
    name VARCHAR(120) NOT NULL,
    CONSTRAINT fk_mun_province FOREIGN KEY (province_id) REFERENCES provinces(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE stores (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    municipality_id INT UNSIGNED NOT NULL,
    name VARCHAR(180) NOT NULL,
    trade_name VARCHAR(180) NULL,
    store_type ENUM('armazem', 'mercearia', 'supermercado', 'mercado_municipal') NOT NULL,
    neighborhood VARCHAR(120) NOT NULL,
    landmark VARCHAR(255) NULL,
    phone VARCHAR(30) NOT NULL,
    whatsapp VARCHAR(30) NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    INDEX idx_stores_location (municipality_id, neighborhood),
    CONSTRAINT fk_store_mun FOREIGN KEY (municipality_id) REFERENCES municipalities(id)
) ENGINE=InnoDB;

CREATE TABLE prices (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    store_id BIGINT UNSIGNED NOT NULL,
    product_variant_id BIGINT UNSIGNED NOT NULL,
    price_amount DECIMAL(12,2) NOT NULL,
    normalized_price_per_unit DECIMAL(12,4) NOT NULL,
    source_type ENUM('oficial_armazem', 'contribuicao_comunitaria', 'agente_campo') NOT NULL,
    verification_status ENUM('verificado', 'pendente', 'desatualizado') DEFAULT 'verificado',
    observed_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_prices_lookup (product_variant_id, store_id, created_at DESC),
    INDEX idx_prices_amount (product_variant_id, price_amount ASC)
) ENGINE=InnoDB;`}
              </pre>
            </div>
          )}

          {activeTab === 'services' && (
            <div className="space-y-4 font-sans text-slate-800">
              <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-2">
                <h4 className="font-bold text-slate-900 text-xs">Exemplo do Service em PHP 8.3: BasketSavingsCalculator.php</h4>
                <pre className="bg-slate-900 text-slate-100 p-4 rounded-xl text-xs font-mono overflow-x-auto leading-relaxed">
{`namespace App\\Services;

use App\\Models\\Store;
use App\\Models\\Price;
use Illuminate\\Support\\Collection;

final class BasketSavingsCalculator
{
    /**
     * Calcula o melhor armazém único e a poupança máxima dividida em Kwanzas
     */
    public function calculate(array $basketItems): array
    {
        // 1. Obtém a lista dos preços mais recentes para cada loja em Luanda
        // 2. Calcula custo total no mesmo estabelecimento
        // 3. Identifica a melhor opção com o menor valor total em Kwanzas
        // ... Código tipado com readonly properties e DTOs
        return [
            'best_single_store' => $bestStore,
            'split_total_cost'  => $minSplitCost,
            'savings_in_kwanza' => $savingsAmount,
        ];
    }
}`}
                </pre>
              </div>
            </div>
          )}

          {activeTab === 'deploy' && (
            <div className="space-y-4 font-sans text-slate-800">
              <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-2">
                <h4 className="font-bold text-slate-900 text-xs">Comandos de Execução no Servidor de Produção</h4>
                <pre className="bg-slate-900 text-slate-100 p-4 rounded-xl text-xs font-mono overflow-x-auto leading-relaxed">
{`# 1. Instalar dependências PHP
composer install --no-dev --optimize-autoloader

# 2. Executar migrações do MySQL 8 e Seeders da Cesta Básica de Luanda
php artisan migrate --force
php artisan db:seed --class=AngolaGeographicSeeder
php artisan db:seed --class=BasicBasketCatalogSeeder
php artisan db:seed --class=LuandaStoresSeeder

# 3. Otimizar Caches do Laravel
php artisan config:cache
php artisan route:cache
php artisan view:cache`}
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* Rodapé do Modal */}
        <div className="p-4 border-t border-slate-200 bg-white flex items-center justify-between">
          <span className="text-xs text-slate-500 font-sans">
            Especificação completa de engenharia conforme os 22 pontos do Prompt Mestre
          </span>
          <button
            onClick={onClose}
            className="min-h-[44px] px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800 font-sans"
          >
            Fechar Janela
          </button>
        </div>
      </div>
    </div>
  );
};
