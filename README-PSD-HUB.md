# 🚀 PSD Hub - Consolidado

Hub Central consolidado do ecossistema Propaga Digital

## 📊 Objetivo

Consolidar 12 apps PSD em um único hub central com:
- 82+ routers originais
- 12 routers novos (dos apps consolidados)
- 20+ serviços compartilhados
- Economia de 3-4 GB de espaço

## 🛠️ Stack

- **Frontend:** React 19 + Tailwind CSS 4
- **Backend:** Express.js + tRPC 11
- **Database:** Drizzle ORM + MySQL/TiDB
- **Auth:** Manus OAuth

## 🚀 Começar

```bash
# Instalar dependências
pnpm install

# Desenvolvimento
pnpm dev

# Build
pnpm build

# Produção
pnpm start
```

## 📁 Estrutura

```
psd-hub/
├── client/          # Frontend React
├── server/          # Backend Express + tRPC
├── drizzle/         # Database schema
├── shared/          # Código compartilhado
└── package.json
```

## 📦 Apps Consolidados

### Biblioteca Compartilhada
- psd-core-v2 (20+ serviços)

### Apps Dependentes
- psd-ai-customer-support
- psd-analytics-service
- psd-content-generator
- psd-dashboard-operacional
- psd-monitoring-service
- psd-payment-gateway
- psd-trend-radar

### Apps Independentes
- psd-core
- psd-operations
- psd-creation
- psd-finalization

## 📝 Licença

MIT
