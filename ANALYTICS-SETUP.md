# 📊 Analytics Setup Guide - PSD HUB

## 🎯 Objetivo

Implementar tracking completo para medir performance, entender comportamento de usuários e otimizar conversões.

---

## 📈 Google Analytics 4 Setup

### 1. Criar Propriedade GA4

```
1. Acessar: https://analytics.google.com
2. Clique em "Admin"
3. Clique em "Create Property"
4. Nome: "CACHA-A-CUTELARIA"
5. Timezone: "America/Sao_Paulo"
6. Currency: "BRL"
7. Clique em "Create"
```

### 2. Instalar Google Analytics

**No arquivo `client/src/main.tsx`:**

```typescript
import { useEffect } from 'react';
import ReactGA from 'react-ga4';

// Inicializar GA4
ReactGA.initialize('G-XXXXXXXXXX'); // Seu Measurement ID

// Rastrear página
useEffect(() => {
  ReactGA.send({ hitType: "pageview", page: window.location.pathname });
}, [location]);
```

### 3. Configurar Eventos Principais

```typescript
// Evento: Visualizar Produto
ReactGA.event('view_item', {
  currency: 'BRL',
  value: product.price,
  items: [{
    item_id: product.id,
    item_name: product.name,
    price: product.price,
    quantity: 1,
  }],
});

// Evento: Adicionar ao Carrinho
ReactGA.event('add_to_cart', {
  currency: 'BRL',
  value: product.price,
  items: [{
    item_id: product.id,
    item_name: product.name,
    price: product.price,
    quantity: quantity,
  }],
});

// Evento: Iniciar Checkout
ReactGA.event('begin_checkout', {
  currency: 'BRL',
  value: cartTotal,
  items: cartItems,
});

// Evento: Compra Realizada
ReactGA.event('purchase', {
  transaction_id: order.id,
  currency: 'BRL',
  value: order.total,
  items: order.items,
  shipping: order.shipping,
  tax: order.tax,
});

// Evento: Deixar Review
ReactGA.event('custom_event', {
  event_name: 'leave_review',
  product_id: product.id,
  rating: rating,
  review_length: review.length,
});

// Evento: Compartilhar Produto
ReactGA.event('share', {
  method: 'facebook', // ou 'twitter', 'whatsapp', etc
  content_type: 'product',
  item_id: product.id,
});
```

### 4. Configurar Conversões

**No Google Analytics:**

```
1. Vá para "Events"
2. Clique em "Mark as conversion"
3. Marque como conversão:
   - purchase
   - add_to_cart
   - begin_checkout
   - leave_review
   - share
```

### 5. Criar Dashboards Personalizados

**Dashboard 1: Overview**
- Usuários ativos
- Taxa de rejeição
- Duração média da sessão
- Páginas por sessão

**Dashboard 2: E-Commerce**
- Receita total
- Número de transações
- Valor médio do pedido
- Taxa de conversão

**Dashboard 3: Comportamento**
- Páginas mais visitadas
- Fluxo de usuários
- Eventos mais acionados
- Funil de conversão

---

## 🎯 Eventos Customizados

### Estrutura de Eventos

```typescript
interface CustomEvent {
  event_name: string;
  event_category: string;
  event_label: string;
  event_value: number;
  user_id?: string;
  session_id?: string;
  timestamp: number;
  properties: Record<string, any>;
}
```

### Eventos Implementados

#### 1. Navegação
```typescript
// Visualizar página
trackEvent('page_view', 'navigation', '/products', 0, {
  page_title: 'Catálogo de Facas',
  page_path: '/products',
});

// Clicar em link
trackEvent('click_link', 'navigation', 'home', 0, {
  link_text: 'Home',
  link_url: '/',
});
```

#### 2. Produtos
```typescript
// Visualizar produto
trackEvent('view_product', 'products', product.id, product.price, {
  product_name: product.name,
  product_category: product.category,
  product_price: product.price,
  product_rating: product.rating,
});

// Filtrar produtos
trackEvent('filter_products', 'products', 'filter', 0, {
  filter_type: 'price',
  filter_value: '100-500',
  results_count: 15,
});

// Buscar produtos
trackEvent('search_products', 'products', 'search', 0, {
  search_query: 'faca chef',
  results_count: 8,
});
```

#### 3. Carrinho
```typescript
// Adicionar ao carrinho
trackEvent('add_to_cart', 'cart', product.id, product.price, {
  product_name: product.name,
  quantity: 1,
  cart_total: cartTotal,
});

// Remover do carrinho
trackEvent('remove_from_cart', 'cart', product.id, product.price, {
  product_name: product.name,
  quantity: 1,
  cart_total: cartTotal,
});

// Visualizar carrinho
trackEvent('view_cart', 'cart', 'view', cartTotal, {
  items_count: cartItems.length,
  cart_total: cartTotal,
});
```

#### 4. Checkout
```typescript
// Iniciar checkout
trackEvent('begin_checkout', 'checkout', 'start', cartTotal, {
  items_count: cartItems.length,
  cart_total: cartTotal,
});

// Adicionar informações de envio
trackEvent('add_shipping_info', 'checkout', 'shipping', 0, {
  shipping_method: 'standard',
  shipping_cost: shippingCost,
});

// Adicionar método de pagamento
trackEvent('add_payment_info', 'checkout', 'payment', 0, {
  payment_method: 'credit_card',
});

// Completar compra
trackEvent('purchase', 'checkout', 'complete', orderTotal, {
  transaction_id: order.id,
  items_count: order.items.length,
  order_total: orderTotal,
  shipping_cost: order.shipping,
  tax: order.tax,
});

// Erro no checkout
trackEvent('checkout_error', 'checkout', 'error', 0, {
  error_type: 'payment_failed',
  error_message: 'Card declined',
});
```

#### 5. Autenticação
```typescript
// Signup
trackEvent('sign_up', 'auth', 'signup', 0, {
  signup_method: 'email',
  user_email: user.email,
});

// Login
trackEvent('login', 'auth', 'login', 0, {
  login_method: 'email',
  user_email: user.email,
});

// Logout
trackEvent('logout', 'auth', 'logout', 0, {
  user_id: user.id,
});
```

#### 6. Gamificação
```typescript
// Ganhar pontos
trackEvent('earn_points', 'gamification', 'points', pointsEarned, {
  points_type: 'purchase',
  total_points: user.totalPoints,
});

// Desbloquear badge
trackEvent('unlock_badge', 'gamification', badge.id, 0, {
  badge_name: badge.name,
  badge_type: badge.type,
});

// Usar referral
trackEvent('use_referral', 'gamification', 'referral', discountAmount, {
  referral_code: code,
  discount_amount: discountAmount,
});
```

#### 7. Comunidade
```typescript
// Deixar review
trackEvent('leave_review', 'community', product.id, 0, {
  product_name: product.name,
  rating: rating,
  review_length: review.length,
});

// Criar post no fórum
trackEvent('create_forum_post', 'community', 'forum', 0, {
  post_title: title,
  post_category: category,
});

// Compartilhar produto
trackEvent('share_product', 'community', product.id, 0, {
  share_method: 'facebook',
  product_name: product.name,
});
```

---

## 📊 Funil de Conversão

### Definir Funil

```
1. Visitante
   ↓
2. Visualiza Produto
   ↓
3. Adiciona ao Carrinho
   ↓
4. Inicia Checkout
   ↓
5. Completa Compra
```

### Rastrear Funil

```typescript
const trackFunnel = (step: number, stepName: string) => {
  ReactGA.event('funnel_step', {
    step_number: step,
    step_name: stepName,
    funnel_name: 'purchase_funnel',
  });
};

// Usar
trackFunnel(1, 'view_product');
trackFunnel(2, 'add_to_cart');
trackFunnel(3, 'begin_checkout');
trackFunnel(4, 'purchase');
```

---

## 🎯 Segmentação de Usuários

### Criar Segmentos

**Segmento 1: High-Value Customers**
- Receita total > R$ 1.000
- Número de transações > 3
- Tempo desde primeira compra > 30 dias

**Segmento 2: At-Risk Customers**
- Última compra > 60 dias atrás
- Número de transações = 1
- Tempo desde primeira compra > 90 dias

**Segmento 3: Engaged Users**
- Número de eventos > 50
- Tempo em site > 5 minutos
- Número de páginas visitadas > 5

**Segmento 4: Mobile Users**
- Device category = mobile
- Qualquer atividade

---

## 📱 Heatmaps & Session Recording

### Implementar Clarity (Microsoft)

```typescript
// Adicionar script no index.html
<script type="text/javascript">
  (function(c,l,a,r,i,t,y){
    c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
    t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
    y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
  })(window, document, "clarity", "script", "YOUR_CLARITY_ID");
</script>
```

### Configurar Heatmaps

1. Acessar: https://clarity.microsoft.com
2. Criar projeto
3. Instalar script
4. Visualizar heatmaps
5. Analisar comportamento

---

## 📈 Relatórios Automáticos

### Email Reports (Semanal)

```
Assunto: Relatório Semanal - CACHA-A-CUTELARIA

Semana de: 01/01/2024 a 07/01/2024

📊 Resumo
- Visitantes: 5.234
- Sessões: 6.891
- Usuários novos: 1.234
- Taxa de rejeição: 32%

💰 E-Commerce
- Receita: R$ 12.450
- Transações: 45
- Valor médio: R$ 276
- Taxa de conversão: 2.1%

👥 Comportamento
- Página mais visitada: /products (1.234 views)
- Tempo médio em site: 4:32
- Páginas por sessão: 3.2
- Evento mais acionado: add_to_cart (234)

🎯 Top Produtos
1. Faca de Chef (45 vendas, R$ 4.500)
2. Faca de Pão (32 vendas, R$ 2.560)
3. Faca Santoku (28 vendas, R$ 2.240)

📱 Dispositivos
- Desktop: 65% (R$ 8.093)
- Mobile: 30% (R$ 3.735)
- Tablet: 5% (R$ 622)

🌍 Localização
- São Paulo: 45%
- Rio de Janeiro: 20%
- Minas Gerais: 15%
- Outros: 20%
```

### Dashboard Executivo

Acessar em: `/admin/analytics`

Métricas principais:
- Revenue (dia, semana, mês)
- Conversion rate
- Average order value
- Customer acquisition cost
- Customer lifetime value
- Churn rate
- Net promoter score

---

## 🔍 Análise de Dados

### Análise Semanal

1. **Performance Review**
   - Receita vs. meta
   - Conversão vs. histórico
   - Tráfego vs. semana anterior

2. **Comportamento de Usuários**
   - Páginas mais visitadas
   - Funil de conversão
   - Pontos de abandono

3. **Produtos**
   - Top sellers
   - Produtos com baixa conversão
   - Produtos com alta taxa de devolução

4. **Canais**
   - Performance por canal
   - ROI por canal
   - Custo de aquisição por canal

### Análise Mensal

1. **Crescimento**
   - MoM growth rate
   - Novos clientes
   - Clientes repetidos

2. **Rentabilidade**
   - Margem bruta
   - Margem líquida
   - Custo de aquisição
   - Lifetime value

3. **Otimizações**
   - Testes A/B realizados
   - Melhorias implementadas
   - Impacto das mudanças

---

## 🎯 Metas & KPIs

### Mês 1
- Visitantes: 10k
- Conversão: 1.5%
- Receita: R$ 15k
- AOV: R$ 250

### Mês 2
- Visitantes: 25k
- Conversão: 2%
- Receita: R$ 50k
- AOV: R$ 275

### Mês 3
- Visitantes: 40k
- Conversão: 2.5%
- Receita: R$ 80k
- AOV: R$ 300

---

## 📞 Troubleshooting

### GA4 não rastreando eventos
- Verificar Measurement ID
- Verificar se script está instalado
- Verificar console para erros
- Aguardar 24h para dados aparecerem

### Eventos não aparecem
- Verificar nomes dos eventos
- Verificar se evento está marcado como conversão
- Verificar filtros de dados
- Verificar se usuário não está em modo incógnito

---

## ✅ Checklist

- [ ] GA4 propriedade criada
- [ ] Measurement ID configurado
- [ ] Script instalado no site
- [ ] Eventos customizados implementados
- [ ] Conversões marcadas
- [ ] Dashboards criados
- [ ] Segmentos criados
- [ ] Heatmaps configurados
- [ ] Email reports agendados
- [ ] Análise semanal iniciada

---

**Status:** 🟢 **PRONTO PARA IMPLEMENTAÇÃO**

---

**Desenvolvido com ❤️ pelo Super Prompt Autônomo**

**Data:** 2024 | **Versão:** 1.0
