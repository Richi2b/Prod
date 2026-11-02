# PREÇO JUSTO ANGOLA — Documentação Arquitetural de Software

## 1. Visão Geral da Arquitetura
O **PREÇO JUSTO ANGOLA** foi concebido sob o modelo de **Monólito Modular Orientado ao Domínio (Domain-Driven Modular Monolith)** implementado em **Laravel (PHP 8.3+)** com base de dados relacional **MySQL 8** e interface **Progressive Web App (PWA)** otimizada para baixíssimo consumo de dados móveis em Angola.

```
+--------------------------------------------------------------------------+
|                          CAMADA DE CLIENTE (PWA)                         |
|  - Progressive Web App instalável em Android                             |
|  - Service Worker com estratégias de cache (CacheFirst / NetworkFirst)   |
|  - Interface Mobile-First responsiva com Tailwind CSS v4                 |
|  - Calculadora de cabaz e listas armazenadas localmente                  |
+--------------------------------------------------------------------------+
                                     |
                                     | HTTPS / REST JSON API
                                     v
+--------------------------------------------------------------------------+
|                     CAMADA DE ENTRADA HTTP (LARAVEL)                     |
|  - RateLimiting (proteção de pacotes e anti-scraping)                    |
|  - Middleware de Sessão e Autenticação (Sanctum / Session Segura)        |
|  - FormRequests (validação estrita antes do controller)                  |
|  - Controllers enxutos (Thin Controllers)                                |
+--------------------------------------------------------------------------+
                                     |
                                     v
+--------------------------------------------------------------------------+
|                       SERVIÇOS DE NEGÓCIO (SERVICES)                     |
|  - PriceComparisonService (ranking, menor preço, normalização por kg/L)  |
|  - BasketSavingsCalculator (simulação do cabaz básico e poupança)        |
|  - UnitNormalizationService (conversão métrica padronizada)              |
|  - PriceConfidenceScorer (pontuação de frescura temporal e reputação)   |
+--------------------------------------------------------------------------+
                                     |
                                     v
+--------------------------------------------------------------------------+
|                     PERSISTÊNCIA & ARMAZENAMENTO                         |
|  - MySQL 8 com Foreign Keys, Índices Compostos e UTF8MB4                 |
|  - Tabela `prices` com histórico imutável (Price Ledger Pattern)         |
|  - Isolamento rigoroso multilocatário via Policies do Laravel            |
+--------------------------------------------------------------------------+
```

## 2. Padrões de Domínio e Decisões Críticas

### 2.1 Padrão Price Ledger (Histórico Imutável)
Em Angola, a volatilidade dos preços decorrente de fatores de importação exige que o sistema nunca execute `UPDATE` no preço antigo de um produto. Cada cotação gera um novo registo na tabela `prices` com:
- `price_amount`: Valor em Kwanzas (DECIMAL 12,2).
- `normalized_price_per_unit`: Preço por kg ou litro (DECIMAL 12,4).
- `source_type`: Origem (Armazenista Oficial, Contribuição de Consumidor, Agente de Campo).
- `observed_date`: Data da observação em terreno.
- `created_at`: Data e hora exata do registo no servidor.

### 2.2 Normalização de Embalagens e Variantes
O sistema proíbe comparações erróneas entre embalagens distintas (ex: comparar um saco de 25 kg com um pacote de 1 kg). Toda a comparação calcula automaticamente o valor unitário por quilograma (`Kz/kg`) ou litro (`Kz/L`), permitindo ao consumidor saber se comprar a grosso compensa face ao retalho.

### 2.3 Resiliência Offline e Economia de Dados Móveis
A aplicação PWA armazena localmente o catálogo de produtos e os armazéns visitados. Em condições de ligação 2G/3G instável, o consumidor continua a aceder à sua lista de compras e ao comparador offline, com selo explicativo da data dos dados guardados.
