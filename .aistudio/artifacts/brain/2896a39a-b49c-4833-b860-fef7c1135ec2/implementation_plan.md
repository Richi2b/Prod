# PREÇO JUSTO ANGOLA — Documento de Arquitetura e Planeamento de Produto (Fase 1)

> **Documento Oficial de Engenharia e Especificação Técnica**  
> **Versão:** 1.0.0 — Fase 1: Planeamento & Arquitetura  
> **Mercado Inicial:** Angola (Província de Luanda — Municípios de Luanda, Viana, Belas, Cazenga, Cacuaco, Kilamba Kiaxi e Talatona)  
> **Moeda:** Kwanza Angolano (AOA / Kz)  
> **Stack Base Definida:** PHP 8.3+ / Laravel / MySQL 8 / PWA / Tailwind CSS

---

## User Review & Decisões Críticas de Alinhamento

[!IMPORTANT]
As seguintes decisões arquiteturais foram consolidadas com base nas respostas de alinhamento da equipa e do responsável pelo produto:

- **Decisão 1 (Stack e Especificação)**: Especificação técnica rigorosa e integral em **Laravel (PHP 8.3+) e MySQL 8**, acompanhada de esquemas de migração, modelos Eloquent com tipagem estrita, repositórios/serviços de domínio e arquitetura PWA offline-first adaptada ao ecossistema web moderno.
- **Decisão 2 (Foco do MVP)**: Prioridade absoluta no **Comparador de Preços e Calculadora de Poupança do Cabaz Familiar**, permitindo que qualquer consumidor descubra onde comprar mais barato sem barreiras de autenticação.
- **Decisão 3 (Segmento de Estabelecimentos Inicial em Luanda)**: Foco de lançamento em **armazéns e mercearias dos bairros de Luanda** (como armazéns do São Paulo, Viana, Palanca, Grafanil, Kikolo e mercados locais), complementados por grandes redes de retalho quando relevante.

---

## 1. Análise do Produto

### 1.1 O Problema Real em Angola
Em Angola, a dispersão de preços de bens de consumo de primeira necessidade (arroz, óleo vegetal, açúcar, farinha de milho/trigo, sabão, leite em pó) entre estabelecimentos no mesmo bairro ou município pode ultrapassar **30% a 50%**.  
- **Assimetria de Informação**: O consumidor gasta tempo e dinheiro em transportes (táxis/candongueiros) para sondar preços física ou telefonicamente.
- **Inflação e Volatilidade**: Preços alteram com frequência mediante taxas cambiais de importação e custos logísticos internos.
- **Barreiras Digitais**: Custo elevado de pacotes de dados móveis (Unitel/Africell/Movicel), redes 3G/4G instáveis em horários de pico e prevalência de smartphones Android de gama de entrada.

### 1.2 Proposta de Valor
- **Para as Famílias e Consumidores**: *"Descobre onde comprar mais barato, compara preços e poupa dinheiro nas tuas compras do mês e do dia a dia."*
  - Acesso gratuito e imediato sem registo forçado.
  - Modo ultra-leve com dados em cache local.
  - Calculadora de poupança direta em Kwanzas (Kz).
- **Para Comerciantes e Armazenistas**: *"Divulga os teus produtos, alcança novos clientes e aumenta a visibilidade do teu negócio no teu bairro e município."*
  - Ferramenta simples de atualização de preços diários e divulgação direta aos clientes da sua zona geográfica.

### 1.3 Personas
1. **Dona Teresa (Gestora do Lar, Viana)**: Tem orçamento estrito de 80.000 Kz para o cabaz quinzenal. Quer saber se compensa comprar o saco de arroz de 25 kg no armazém da Robaldina ou na mercearia do bairro.
2. **Kassoma (Estudante/Trabalhador Independente, Kilamba Kiaxi)**: Smartphone económico com plano de dados limitado. Consulta a app na paragem de táxi para saber onde comprar leite e massa alimentar com menor custo.
3. **Sr. Baptista (Proprietário de Armazém no São Paulo / Luanda)**: Vende a grosso e a retalho. Quer que os compradores saibam que o seu óleo alimentar e fuba de milho estão ao melhor preço do município.

---

## 2. Arquitetura Proposta

O PREÇO JUSTO adota uma **Arquitetura de Monólito Modular Orientada ao Domínio (Domain-Driven Modular Monolith)** em Laravel.

### 2.1 Princípios Arquiteturais
1. **Thin Controllers & Rich Domain Services**: Controllers apenas recebem pedidos validados via `FormRequest` e delegam operações a `Services` de negócio.
2. **Histórico Imutável de Preços (Price Ledger Pattern)**: O preço de um produto num estabelecimento nunca é sobrescrito (`UPDATE`). Cada alteração gera um novo registo na tabela `prices` com timestamp, fonte e estado de verificação, garantindo rastreabilidade histórica e cálculo de tendências.
3. **Cache de Consulta Otimizada**: Preços correntes consolidados são cacheados (Redis/Arquivo) por chave composta `store_id + product_variant_id` para evitar consultas N+1 repetidas.
4. **Resiliência Offline-First na PWA**: Service Worker inteligente com estratégia `NetworkFirst` para pesquisas com fallback para `CacheFirst` de catálogos e armazenamento local via `IndexedDB/localStorage` para listas de compras.

---

## 3. Estrutura de Diretórios do Projeto

```
preco-justo/
├── app/
│   ├── Enums/
│   │   ├── PriceSourceType.php       # MERCHANT, CROWDSOURCING, SCRAPED, OFFICIAL
│   │   ├── VerificationStatus.php    # PENDING, VERIFIED, REJECTED, EXPIRED
│   │   ├── StoreType.php             # WAREHOUSE, GROCERY, SUPERMARKET, MARKET_STALL
│   │   └── UnitOfMeasure.php         # KG, G, L, ML, UNIT, PACK, BAG
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── Api/
│   │   │   │   ├── PriceComparisonApiController.php
│   │   │   │   ├── ProductCatalogApiController.php
│   │   │   │   └── ShoppingBasketApiController.php
│   │   │   ├── Web/
│   │   │   │   ├── HomeController.php
│   │   │   │   ├── ProductController.php
│   │   │   │   ├── StoreController.php
│   │   │   │   ├── PriceSubmissionController.php
│   │   │   │   ├── BasketCalculatorController.php
│   │   │   │   └── Merchant/
│   │   │   │       ├── DashboardController.php
│   │   │   │       └── BulkPriceUpdateController.php
│   │   ├── Requests/
│   │   │   ├── StorePriceSubmissionRequest.php
│   │   │   ├── BasketCalculateRequest.php
│   │   │   └── BulkPriceUpdateRequest.php
│   │   └── Resources/
│   │       ├── ProductResource.php
│   │       ├── PriceComparisonResource.php
│   │       └── StoreResource.php
│   ├── Models/
│   │   ├── User.php
│   │   ├── Merchant.php
│   │   ├── Store.php
│   │   ├── Province.php
│   │   ├── Municipality.php
│   │   ├── Neighborhood.php
│   │   ├── Category.php
│   │   ├── Brand.php
│   │   ├── Product.php
│   │   ├── ProductVariant.php
│   │   ├── Price.php
│   │   ├── PriceSubmission.php
│   │   ├── ShoppingList.php
│   │   ├── ShoppingListItem.php
│   │   └── AuditLog.php
│   ├── Services/
│   │   ├── PriceComparisonService.php     # Algoritmo de menor preço, normalização por kg/litro
│   │   ├── BasketSavingsCalculator.php    # Cálculo da cesta mais barata e poupança agregada
│   │   ├── UnitNormalizationService.php   # Conversões para métrica comum (Kz/kg, Kz/L)
│   │   ├── PriceConfidenceScorer.php      # Pontuação de frescura (tempo) e reputação da fonte
│   │   └── ImageOptimizationService.php   # Redimensionamento e compressão WebP em servidor
│   └── Policies/
│       ├── StorePolicy.php
│       └── PriceSubmissionPolicy.php
├── database/
│   ├── migrations/
│   │   ├── 2026_01_01_000001_create_geographic_tables.php
│   │   ├── 2026_01_01_000002_create_catalog_tables.php
│   │   ├── 2026_01_01_000003_create_stores_and_merchants_tables.php
│   │   ├── 2026_01_01_000004_create_prices_and_submissions_tables.php
│   │   └── 2026_01_01_000005_create_shopping_lists_and_audit_tables.php
│   └── seeders/
│       ├── AngolaGeographicSeeder.php    # Luanda, Viana, Belas, Cazenga, etc.
│       ├── BasicBasketCatalogSeeder.php  # Cesta básica de Luanda (arroz, óleo, fuba, etc.)
│       └── LuandaStoresSeeder.php        # Armazéns e mercearias reais de Luanda
├── public/
│   ├── manifest.json                     # PWA Web App Manifest
│   ├── sw.js                             # Service Worker com cache offline
│   └── icons/                            # Ícones adaptativos PWA (192px, 512px)
├── resources/
│   ├── views/
│   │   ├── layouts/
│   │   │   ├── app.blade.php             # Layout Mobile-First
│   │   │   └── navigation.blade.php      # Bottom Navigation Bar ergonómica
│   │   ├── consumer/
│   │   │   ├── home.blade.php
│   │   │   ├── search.blade.php
│   │   │   ├── product-detail.blade.php
│   │   │   ├── compare.blade.php
│   │   │   └── basket.blade.php
│   │   └── merchant/
│   └── css/
│       └── app.css                       # Tailwind CSS v4 com paleta Angolana
└── docs/
    ├── ARCHITECTURE.md
    ├── DATABASE.md
    └── DEPLOYMENT.md
```

---

## 4. Diagrama da Arquitetura do Sistema

```
┌───────────────────────────────────────────────────────────────────────────┐
│                           CAMADA DE CLIENTE (PWA)                         │
│  ┌─────────────────────────────┐         ┌─────────────────────────────┐  │
│  │ Navegador Mobile / PWA App  │         │ Service Worker (Cache / SW) │  │
│  │ (HTML5 / Tailwind / Blade)  │ <─────> │ - Shell App (HTML/CSS/JS)   │  │
│  │ - Pesquisa Instantânea      │         │ - Cache de Catálogo Básico  │  │
│  │ - Calculadora Cabaz Offline │         │ - Fallback Página Offline   │  │
│  └──────────────┬──────────────┘         └─────────────────────────────┘  │
└─────────────────┼─────────────────────────────────────────────────────────┘
                  │ HTTPS / JSON / Blade View Requests
                  ▼
┌───────────────────────────────────────────────────────────────────────────┐
│                      GATEWAY / KERNEL HTTP (LARAVEL)                      │
│  ┌─────────────────────────────────────────────────────────────────────┐  │
│  │ Middleware Stack: RateLimiting, SecurityHeaders, CSRF, Auth (Sanctum)│  │
│  └──────────────────────────────────┬──────────────────────────────────┘  │
│                                     ▼                                     │
│  ┌─────────────────────────────────────────────────────────────────────┐  │
│  │ Controllers Web & API (Requests validadas por FormRequests)        │  │
│  └──────────────────────────────────┬──────────────────────────────────┘  │
└─────────────────────────────────────┼─────────────────────────────────────┘
                                      ▼
┌───────────────────────────────────────────────────────────────────────────┐
│                        CAMADA DE SERVIÇOS DE DOMÍNIO                      │
│  ┌────────────────────────────┐         ┌──────────────────────────────┐  │
│  │  PriceComparisonService    │         │   BasketSavingsCalculator    │  │
│  │  - Normalização Kz/kg, Kz/L│         │   - Simulação Cabaz Familiar │  │
│  │  - Ranking por Preço/Local │         │   - Deteção do Armazém + Eco │  │
│  └─────────────┬──────────────┘         └──────────────┬───────────────┘  │
│                │                                       │                  │
│  ┌─────────────▼──────────────┐         ┌──────────────▼───────────────┐  │
│  │  PriceConfidenceScorer     │         │   UnitNormalizationService   │  │
│  │  - Frescura (horas/dias)   │         │   - Conversão de grandezas   │  │
│  │  - Nível de Confiança      │         │   - Comparação justa         │  │
│  └────────────────────────────┘         └──────────────────────────────┘  │
└─────────────────────────────────────┬─────────────────────────────────────┘
                                      ▼
┌───────────────────────────────────────────────────────────────────────────┐
│                       PERSISTÊNCIA & ARMAZENAMENTO                        │
│  ┌─────────────────────────────────────────────────────────────────────┐  │
│  │ MySQL 8 com Índices Compostos e Chaves Estrangeiras                │  │
│  │ [stores] <─ [prices] ─> [product_variants] <─ [products]           │  │
│  │ Histórico Imutável de Preços + Particionamento por data/frescura   │  │
│  └─────────────────────────────────────────────────────────────────────┘  │
└───────────────────────────────────────────────────────────────────────────┘
```

---

## 5. Diagrama Entidade-Relacionamento (ERD)

```
  ┌──────────────────┐               ┌──────────────────┐
  │    provinces     │               │  municipalities  │
  ├──────────────────┤ 1           N ├──────────────────┤
  │ id (PK)          ├───────────────┤ id (PK)          │
  │ name             │               │ province_id (FK) │
  └──────────────────┘               │ name             │
                                     └─────────┬────────┘
                                               │ 1
                                               │
                                               │ N
  ┌──────────────────┐               ┌─────────▼────────┐
  │    merchants     │ 1           N │  neighborhoods   │
  ├──────────────────┤───────────────┤ (Bairros Luanda) │
  │ id (PK)          │               ├──────────────────┤
  │ business_name    │               │ id (PK)          │
  │ nif              │               │ municipality_id  │
  │ is_verified      │               │ name             │
  └────────┬─────────┘               └─────────┬────────┘
           │ 1                                 │ 1
           │                                   │
           │ N                                 │ N
  ┌────────▼───────────────────────────────────▼────────┐
  │                       stores                        │
  │ (Armazéns, Mercearias e Supermercados de Luanda)    │
  ├─────────────────────────────────────────────────────┤
  │ id (PK)                                             │
  │ merchant_id (FK, nullable para informais)           │
  │ neighborhood_id (FK)                                │
  │ name (ex: "Armazém do Povo - Palanca")             │
  │ store_type (WAREHOUSE, GROCERY, SUPERMARKET)        │
  │ address_details / landmark                          │
  │ latitude, longitude (nullable)                      │
  │ contact_phone, whatsapp                             │
  │ is_active                                           │
  └──────────────────────────┬──────────────────────────┘
                             │ 1
                             │
                             │ N
  ┌──────────────────────────▼──────────────────────────┐
  │                       prices                        │
  │           (Histórico Imutável de Preços)            │
  ├─────────────────────────────────────────────────────┤
  │ id (PK)                                             │
  │ store_id (FK)                                       │
  │ product_variant_id (FK)                             │
  │ price_amount (DECIMAL 12,2 - em Kz)                 │
  │ normalized_price_per_unit (DECIMAL 12,4 - Kz/kg)    │
  │ source_type (MERCHANT, CROWDSOURCING, OFFICIAL)     │
  │ verification_status (VERIFIED, PENDING, EXPIRED)    │
  │ verified_at (DATETIME)                              │
  │ observed_date (DATE)                                │
  │ created_at (DATETIME)                               │
  └──────────────────────────▲──────────────────────────┘
                             │ N
                             │
                             │ 1
  ┌──────────────────────────┴──────────────────────────┐
  │                  product_variants                   │
  │ (Ex: Saco 25kg, Pacote 1kg, Garrafa 1L)            │
  ├─────────────────────────────────────────────────────┤
  │ id (PK)                                             │
  │ product_id (FK)                                     │
  │ variant_name (ex: "Saco 25 kg", "Garrafa 900 ml")   │
  │ package_quantity (DECIMAL 8,3 - ex: 25.000)         │
  │ unit_id (FK - KG, L, UNIT)                          │
  │ barcode (nullable)                                  │
  │ is_default                                          │
  └──────────────────────────▲──────────────────────────┘
                             │ N
                             │
                             │ 1
  ┌──────────────────────────┴──────────────────────────┐
  │                      products                       │
  │ (Ex: Arroz Coração, Óleo Sovena, Açúcar Doce Luanda)│
  ├─────────────────────────────────────────────────────┤
  │ id (PK)                                             │
  │ category_id (FK)                                    │
  │ brand_id (FK)                                       │
  │ name                                                │
  │ slug                                                │
  │ image_url (WebP comprimida < 40KB)                  │
  │ description                                         │
  │ is_basic_basket (BOOLEAN - Pertence ao Cabaz Básico)│
  └─────────────────────────────────────────────────────┘
```

---

## 6. Modelo de Dados e Dicionário de Estrutura

### 6.1 Tabelas Estruturais
- **`provinces` & `municipalities` & `neighborhoods`**:
  - `provinces`: Luanda, Benguela, Huíla, etc.
  - `municipalities`: Luanda (Ingombota, Maianga, Sambizanga, Rangel), Viana, Belas, Kilamba Kiaxi, Cazenga, Cacuaco, Talatona.
  - `neighborhoods`: Palanca, Rocha Pinto, Morro Bento, Estalagem, Grafanil, São Paulo, Kikolo, Golfe 2, Mutamba, etc.
- **`products` & `product_variants`**:
  - Distinção clara de variantes: um saco de 25 kg de arroz tem ID de variante diferente de um pacote de 1 kg.
  - Campo `normalized_price_per_unit` calculado automaticamente no momento do registo (ex.: `price_amount / 25` = Kz por kg).
- **`prices` (Tabela de Alta Leitura com Índices Estratégicos)**:
  - Índices compostos: `INDEX idx_prices_lookup (product_variant_id, store_id, created_at DESC)`.
  - Índice de ordenação por valor: `INDEX idx_prices_amount (product_variant_id, price_amount ASC)`.
  - Índice de frescura temporal: `INDEX idx_prices_date (observed_date DESC)`.

---

## 7. Fluxos de Utilização Principais

### Fluxo 1: Consumidor — Consulta Instantânea e Comparação de Preços (Sem Registo)
```
[Início] 
   │
   ▼
[Ecrã Inicial Mobile]: Barra de Pesquisa destacada + Atalhos do Cabaz Básico (Arroz, Óleo, Açúcar, Fuba)
   │
   ├─► Digita "Arroz" ou toca no atalho "Arroz 25 kg"
   │
   ▼
[Lista de Resultados]:
   Exibe variantes explícitas (Saco 25kg, Saco 5kg, Pacote 1kg)
   │
   ▼
[Comparador de Preços]:
   ┌─────────────────────────────────────────────────────────────┐
   │ Arroz Coração — Saco 25 kg                                 │
   │ Menor Preço Encontrado: 22.500 Kz (Poupança até 4.000 Kz)   │
   ├─────────────────────────────────────────────────────────────┤
   │ 1. Armazém Aliança (Viana - Estalagem)                      │
   │    Preço: 22.500 Kz · Atualizado hoje às 08:30 (Confirmado) │
   │ 2. Mercearia São Paulo (Rangel)                             │
   │    Preço: 24.200 Kz · Atualizado há 1 dia                   │
   │ 3. Armazém do Povo (Palanca)                                │
   │    Preço: 26.500 Kz · Atualizado há 3 dias                  │
   └─────────────────────────────────────────────────────────────┘
   │
   ▼
[Ação]: Toca para ligar/enviar WhatsApp ao armazém ou adiciona ao "Meu Cabaz de Compras"
```

### Fluxo 2: Consumidor — Calculadora de Poupança do Cabaz Familiar
1. Utilizador seleciona os produtos habituais do seu mês:
   - 1x Saco de Arroz 25 kg
   - 1x Caixa de Óleo Alimentar (12x1L)
   - 1x Saco de Açúcar 25 kg
   - 1x Saco de Fuba de Milho 25 kg
2. Sistema calcula em tempo real:
   - **Opção A (Tudo no mesmo local)**: Armazém mais barato para a lista completa (ex: Total: 78.400 Kz no Armazém Viana Sul).
   - **Opção B (Compra dividida)**: Se comprar o arroz no Armazém A e o óleo no Armazém B, poupa **6.800 Kz adicionais**.
3. Lista fica guardada no smartphone para utilização em modo offline no armazém.

### Fluxo 3: Comerciante / Armazenista — Atualização Diária em Menos de 1 Minuto
1. Comerciante acede via telemóvel ao seu painel simplificado.
2. Vê a lista dos seus produtos principais cadastrados.
3. Altera os preços dos sacos e caixas em campos numéricos diretos.
4. Clica em "Publicar Preços de Hoje".
5. Preços entram imediatamente como verificados com selo de data do dia.

---

## 8. Design System Proposto (Mobile-First & Baixo Consumo de Dados)

### 8.1 Identidade Visual e Paleta de Cores
- **60% Superfície Neutra**: Fundo off-white limpo (`#F8FAFC` no tema claro / `#0F172A` no modo noturno) para leitura sob luz solar direta em Luanda.
- **30% Estrutura e Cartões**: Branco puro (`#FFFFFF`) com divisores subtis hairline de 1px (`border-slate-200`) e cantos arredondados amigáveis (`rounded-2xl` / 16px).
- **10% Acento de Poupança e Marca**:
  - **Verde Poupança / Kwanza**: `#059669` (Emerald 600) — comunica benefício financeiro, economia e transparência.
  - **Âmbar de Atenção/Frescura**: `#D97706` (Amber 600) — destaca preços com mais de 3 dias sem confirmação.
  - **Texto Primário**: `#0F172A` (Slate 900) — alto contraste (WCAG AA ratio > 7:1).

### 8.2 Tipografia e Hierarquia
- **Fonte Principal (Display & UI)**: `Plus Jakarta Sans` ou `DM Sans` (geométrica, moderna, legível em tamanhos reduzidos).
- **Numerais e Preços**: Numerais tabulares (`tabular-nums font-semibold`), garantindo alinhamento vertical dos valores em Kwanzas (ex: `24.500 Kz`).
- **Disciplina Anti-Pílula (Anti-Slop)**: Metadados (bairro, data de atualização, unidade) apresentados como texto limpo separado por pontos tipográficos médios (`·`), sem tags coloridas decorativas.

### 8.3 Ergonomia Tátil
- **Área de Toque Mínima**: Todos os botões e linhas de lista possuem no mínimo **44px x 44px** de hitbox interativo.
- **Bottom Navigation Bar (PWA)**:
  - 4 Destinos principais: `Início`, `Comparar`, `Meu Cabaz`, `Armazéns`.
  - Fixa na base com altura $\le 60\text{px}$ respeitando a regra de ocupação máxima de 15% do ecrã vertical.

---

## 9. Estratégia de Segurança e Proteção de Dados

### 9.1 Autenticação e Autorização (RBAC)
- **Hashing de Senhas**: `Argon2id` nativo do Laravel com custo calibrado.
- **Proteção contra Força Bruta**: Rate limiting rigoroso nos endpoints de autenticação e pesquisa (`throttle:60,1`).
- **Segurança Multilocatário (Merchant Isolation)**: Policies do Laravel (`StorePolicy`) verificam no servidor que um comerciante apenas pode visualizar e alterar preços das suas próprias lojas (`$user->merchant_id === $store->merchant_id`).

### 9.2 Conformidade com a Lei n.º 22/11 de Proteção de Dados Pessoais (Angola)
- **Minimização**: Consumidores usam a pesquisa e a calculadora de poupança de forma totalmente anónima. Nenhum dado pessoal é exigido para consultar preços.
- **Geolocalização Respeitosa**: A app nunca exige coordenadas GPS forçadas; a seleção de bairro/município é manual por padrão, ativando GPS apenas se o utilizador consentir voluntariamente.

### 9.3 Higienização e Uploads
- Fotos de etiquetas submetidas por utilizadores passam por validação estrita de MIME type (`image/jpeg`, `image/webp`, `image/png`), limite de 3 MB e redimensionamento automático no servidor para WebP (máximo 1200px de largura), removendo metadados EXIF privados.

---

## 10. Estratégia de Desempenho e Consumo Mínimo de Dados

Esta diretriz é prioritária para a realidade de Luanda e províncias:

1. **Orçamento de Carga Inicial (< 400 KB)**:
   - HTML semântico com CSS Tailwind v4 minificado.
   - Zero bibliotecas JavaScript pesadas desnecessárias no bundle do consumidor.
2. **Compressão Extrema de Imagens**:
   - Miniaturas de produtos geradas em WebP com qualidade otimizada entre 15 KB e 35 KB.
   - Suporte a fallback SVG com ícone da categoria caso a ligação falhe ou o utilizador ative o "Modo Economia de Dados".
3. **Cache Inteligente PWA (Service Worker)**:
   - `CacheFirst` para fontes, logótipo e assets estáticos.
   - `NetworkFirst` com fallback em cache para a listagem da cesta básica.
   - A lista de compras e os preços recentemente consultados ficam disponíveis no smartphone mesmo sem sinal de rede.

---

## 11. Plano de Testes

| Categoria | Âmbito do Teste | Critério de Sucesso |
| :--- | :--- | :--- |
| **Testes Unitários** | `BasketSavingsCalculatorTest` | Cálculo exato de diferença de cabaz entre 3 armazéns com tratamento de produtos ausentes. |
| **Testes Unitários** | `UnitNormalizationServiceTest` | Conversão correta de saco de 25 kg para Kz/kg e garrafa de 900 ml para Kz/L. |
| **Testes de Integração** | `PriceComparisonApiTest` | Retorno ordenado por menor preço com dados de armazéns filtrados por município de Luanda. |
| **Testes de Autorização** | `MerchantStoreIsolationTest` | Tentativa de um comerciante atualizar preço de loja alheia resulta em HTTP 403 Forbidden. |
| **Testes PWA & Offline** | `ServiceWorkerOfflineTest` | Com rede desligada, a página inicial e a lista de compras previamente abertas carregam sem erro. |
| **Testes de Performance** | `NetworkThrottlingTest` | Emulação de rede 3G Lenta (400 Kbps, 400ms RTT): LCP abaixo de 2.2 segundos. |

---

## 12. Plano de Implementação Faseado

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ CRONOGRAMA DE DESENVOLVIMENTO DO PRODUTO                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│ FASE 1: Planeamento, Modelo ERD e Arquitetura [CONCLUÍDA NESTE DOCUMENTO]  │
├─────────────────────────────────────────────────────────────────────────────┤
│ FASE 2: Fundação Técnica & Base de Dados                                    │
│ - Migrações MySQL normalizadas (geografia de Luanda, lojas, produtos, preços)│
│ - Seeders com dados reais de armazéns e produtos da cesta básica de Luanda   │
│ - Configuração do Layout PWA e Tailwind CSS v4 ergonómico                   │
├─────────────────────────────────────────────────────────────────────────────┤
│ FASE 3: MVP do Consumidor (Core Value)                                      │
│ - Motor de pesquisa tolerante a variações fonéticas                         │
│ - Ecrã de Comparação de Preços com destaque do menor valor e frescura       │
│ - Calculadora do Cabaz Familiar com total estimado e poupança em Kwanzas    │
│ - Filtro geográfico por bairros e armazéns de Luanda                        │
├─────────────────────────────────────────────────────────────────────────────┤
│ FASE 4: Painel Simplificado do Armazenista & Comerciante                    │
│ - Cadastro de armazém/mercearia com contactos e WhatsApp                   │
│ - Atualização expressa de preços dos produtos mais vendidos                │
│ - Selo de confirmação diária                                                │
├─────────────────────────────────────────────────────────────────────────────┤
│ FASE 5: Colaboração Comunitária & Moderação                                 │
│ - Submissão de preço por clientes com upload de foto da etiqueta            │
│ - Algoritmo de deteção de discrepâncias e pontuação de confiança            │
├─────────────────────────────────────────────────────────────────────────────┤
│ FASE 6: PWA Avançada, Cache Offline & Otimizações Finais                    │
│ - Service Worker com persistência local de listas                           │
│ - Auditoria de performance Lighthouse (>90 em Performance e PWA)           │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 13. Dependências, Custos Operacionais e Riscos

### 13.1 Estimativa de Custos Operacionais
- **Infraestrutura Inicial**: VPS Linux (2 vCPU, 4 GB RAM, NVMe) com Nginx + PHP-FPM + MySQL 8 (~$12 a $20/mês).
- **Custos com APIs Externas no Lançamento**: **0 USD**. Nenhuma dependência obrigatória de APIs pagas de terceiros; a inteligência e normalização de preços são executadas internamente por algoritmos determinísticos em PHP.

### 13.2 Análise de Riscos e Mitigações

| Risco Identificado | Nível | Estratégia de Mitigação |
| :--- | :--- | :--- |
| **Preços Desatualizados (Volatilidade)** | Alto | Algoritmo de pontuação de frescura que despromove preços com mais de 72 horas sem confirmação e rotula claramente a data da última verificação. |
| **Resistência Inicial de Comerciantes** | Médio | Entrada facilitada via agentes de terreno com recolha inicial direta e criação de benefício imediato: divulgação gratuita e botões de contacto direto via WhatsApp. |
| **Internet Lenta nos Bairros** | Alto | Arquitetura PWA ultra-leve (< 400 KB) com suporte completo a listas de compras offline e carregamento prioritário de texto sobre imagens. |
| **Tentativa de Manipulação de Preços** | Médio | Preços submetidos por consumidores passam por filtro estatístico de dispersão (desvio padrão) antes de influenciar o preço de referência. |

---

## Conclusão da Fase 1

O plano acima detalha uma arquitetura de nível profissional, estritamente orientada às necessidades económicas e tecnológicas de Angola, combinando o poder do ecossistema Laravel com a leveza de uma PWA otimizada.

**Aguardando a sua aprovação para iniciar a FASE 2 (Fundação Técnica e Estruturação de Dados).**
