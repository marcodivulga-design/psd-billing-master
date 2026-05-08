# 📧 Email Templates - CACHA-A-CUTELARIA

## 🎯 Estrutura Base

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{subject}}</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; background: #fff; }
    .header { background: linear-gradient(135deg, #d4a574 0%, #8b6f47 100%); color: white; padding: 20px; text-align: center; }
    .content { padding: 30px; }
    .footer { background: #f5f5f5; padding: 20px; text-align: center; font-size: 12px; color: #666; }
    .button { display: inline-block; background: #d4a574; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
    .divider { border-top: 1px solid #eee; margin: 20px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>CACHA-A-CUTELARIA</h1>
      <p>Facas Artesanais para Quem Aprecia Qualidade</p>
    </div>
    
    <div class="content">
      {{content}}
    </div>
    
    <div class="footer">
      <p>&copy; 2024 CACHA-A-CUTELARIA. Todos os direitos reservados.</p>
      <p><a href="{{unsubscribe_link}}">Desinscrever-se</a></p>
    </div>
  </div>
</body>
</html>
```

---

## 📧 Email 1: Welcome Email

**Assunto:** Bem-vindo à CACHA-A-CUTELARIA! 🔪 Ganhe 10% de desconto

```html
<h2>Olá {{first_name}}!</h2>

<p>Bem-vindo à CACHA-A-CUTELARIA, a plataforma de facas artesanais mais inovadora do Brasil!</p>

<p>Estamos felizes em tê-lo conosco. Para celebrar, preparamos um presente especial para você:</p>

<div style="background: #f0e6d2; padding: 20px; border-radius: 5px; text-align: center;">
  <h3>10% DE DESCONTO</h3>
  <p>Use o código: <strong>WELCOME10</strong></p>
  <p style="font-size: 12px; color: #666;">Válido para primeira compra</p>
</div>

<h3>O Que Você Pode Fazer Aqui:</h3>
<ul>
  <li><strong>Explorar Facas Artesanais:</strong> Descubra nossa coleção premium de facas 100% artesanais</li>
  <li><strong>Obter Recomendações:</strong> Nossa IA personaliza recomendações baseado em seu perfil</li>
  <li><strong>Ganhar Pontos:</strong> Acumule pontos a cada compra e resgate por prêmios</li>
  <li><strong>Participar da Comunidade:</strong> Compartilhe reviews, dicas e experiências com outros apaixonados por facas</li>
  <li><strong>Desbloquear Badges:</strong> Conquiste achievements e suba no leaderboard</li>
</ul>

<a href="{{store_url}}/products" class="button">Explorar Catálogo</a>

<div class="divider"></div>

<h3>Dúvidas?</h3>
<p>Estamos aqui para ajudar! Responda este email ou acesse nossa <a href="{{store_url}}/faq">Central de Ajuda</a>.</p>

<p>Abraços,<br>
<strong>Equipe CACHA-A-CUTELARIA</strong></p>
```

---

## 📧 Email 2: Product Recommendation

**Assunto:** {{first_name}}, encontramos a faca perfeita para você! 🎯

```html
<h2>Olá {{first_name}}!</h2>

<p>Com base em suas preferências e histórico de navegação, selecionamos especialmente para você:</p>

<div style="background: #f9f9f9; padding: 20px; border-radius: 5px; text-align: center;">
  <img src="{{product_image}}" alt="{{product_name}}" style="max-width: 300px; margin: 20px 0;">
  <h3>{{product_name}}</h3>
  <p>{{product_description}}</p>
  <p><strong>Preço:</strong> R$ {{product_price}}</p>
  <p><strong>Rating:</strong> ⭐ {{product_rating}}/5 ({{product_reviews}} reviews)</p>
  <a href="{{product_url}}" class="button">Ver Detalhes</a>
</div>

<div class="divider"></div>

<h3>Por Que Recomendamos Esta Faca?</h3>
<p>{{recommendation_reason}}</p>

<h3>Clientes Como Você Também Compraram:</h3>
<ul>
  {{#related_products}}
  <li><a href="{{url}}">{{name}}</a> - R$ {{price}}</li>
  {{/related_products}}
</ul>

<p>Aproveite! Este produto está em alta demanda.</p>

<a href="{{product_url}}" class="button">Adicionar ao Carrinho</a>
```

---

## 📧 Email 3: Abandoned Cart

**Assunto:** Esqueceu algo? {{first_name}}, sua faca está esperando! 🛒

```html
<h2>Oi {{first_name}}!</h2>

<p>Notamos que você deixou alguns itens no carrinho. Não se preocupe, guardamos tudo para você!</p>

<div style="background: #f9f9f9; padding: 20px; border-radius: 5px;">
  <h3>Itens no Seu Carrinho:</h3>
  {{#cart_items}}
  <div style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee;">
    <div>
      <strong>{{item_name}}</strong><br>
      <small>Quantidade: {{item_quantity}}</small>
    </div>
    <div>
      <strong>R$ {{item_price}}</strong>
    </div>
  </div>
  {{/cart_items}}
  
  <div style="padding: 10px 0; text-align: right;">
    <h4>Subtotal: R$ {{subtotal}}</h4>
  </div>
</div>

<h3>Por Que Você Deveria Completar Sua Compra?</h3>
<ul>
  <li>✅ Frete grátis para pedidos acima de R$ 200</li>
  <li>✅ Garantia de 2 anos em todas as facas</li>
  <li>✅ Devolução fácil em 30 dias</li>
  <li>✅ Ganhe 100 pontos com esta compra</li>
</ul>

<a href="{{checkout_url}}" class="button">Completar Compra</a>

<p style="font-size: 12px; color: #999;">Seu carrinho expira em 7 dias</p>
```

---

## 📧 Email 4: Order Confirmation

**Assunto:** Pedido Confirmado! 🎉 Número: #{{order_id}}

```html
<h2>Obrigado, {{first_name}}!</h2>

<p>Seu pedido foi confirmado com sucesso! Aqui estão os detalhes:</p>

<div style="background: #e8f5e9; padding: 20px; border-radius: 5px; margin: 20px 0;">
  <h3>Número do Pedido: #{{order_id}}</h3>
  <p><strong>Data:</strong> {{order_date}}</p>
  <p><strong>Status:</strong> ✅ Confirmado</p>
</div>

<h3>Itens Pedidos:</h3>
<div style="background: #f9f9f9; padding: 20px; border-radius: 5px;">
  {{#order_items}}
  <div style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee;">
    <div>
      <strong>{{item_name}}</strong><br>
      <small>Quantidade: {{item_quantity}}</small>
    </div>
    <div>
      <strong>R$ {{item_price}}</strong>
    </div>
  </div>
  {{/order_items}}
  
  <div style="padding: 10px 0;">
    <div style="display: flex; justify-content: space-between; padding: 5px 0;">
      <span>Subtotal:</span>
      <strong>R$ {{subtotal}}</strong>
    </div>
    <div style="display: flex; justify-content: space-between; padding: 5px 0;">
      <span>Frete:</span>
      <strong>R$ {{shipping}}</strong>
    </div>
    <div style="display: flex; justify-content: space-between; padding: 5px 0; border-top: 1px solid #ddd; margin-top: 10px; padding-top: 10px;">
      <span><strong>Total:</strong></span>
      <strong style="font-size: 18px; color: #d4a574;">R$ {{total}}</strong>
    </div>
  </div>
</div>

<h3>Endereço de Entrega:</h3>
<p>
  {{delivery_name}}<br>
  {{delivery_street}}, {{delivery_number}}<br>
  {{delivery_city}}, {{delivery_state}} {{delivery_zip}}<br>
  {{delivery_country}}
</p>

<h3>Próximos Passos:</h3>
<ol>
  <li>Seu pedido está sendo preparado</li>
  <li>Você receberá um email com o código de rastreamento em breve</li>
  <li>Entrega estimada: {{estimated_delivery}}</li>
</ol>

<a href="{{order_tracking_url}}" class="button">Rastrear Pedido</a>

<div class="divider"></div>

<h3>Ganhe Pontos! 🎁</h3>
<p>Você ganhou <strong>{{points_earned}} pontos</strong> com esta compra!</p>
<p>Seu saldo total: <strong>{{total_points}} pontos</strong></p>
<p><a href="{{loyalty_url}}">Ver Programa de Lealdade</a></p>
```

---

## 📧 Email 5: Shipment Notification

**Assunto:** Sua faca está a caminho! 📦 Código: {{tracking_code}}

```html
<h2>Ótimas Notícias, {{first_name}}!</h2>

<p>Seu pedido foi despachado e está a caminho!</p>

<div style="background: #e3f2fd; padding: 20px; border-radius: 5px; margin: 20px 0;">
  <h3>Código de Rastreamento:</h3>
  <p style="font-size: 18px; font-weight: bold; color: #1976d2;">{{tracking_code}}</p>
  <p><strong>Transportadora:</strong> {{carrier_name}}</p>
  <p><strong>Entrega Estimada:</strong> {{estimated_delivery}}</p>
</div>

<a href="{{tracking_url}}" class="button">Rastrear Entrega</a>

<h3>Detalhes do Pedido:</h3>
<p>
  <strong>Número do Pedido:</strong> #{{order_id}}<br>
  <strong>Itens:</strong> {{items_count}} faca(s)<br>
  <strong>Valor Total:</strong> R$ {{total}}
</p>

<h3>Dicas para Receber Sua Faca:</h3>
<ul>
  <li>📍 Certifique-se de que alguém estará disponível para receber</li>
  <li>📞 Você pode contatar a transportadora se precisar agendar entrega</li>
  <li>📦 A faca vem bem embalada e protegida</li>
  <li>✅ Verifique o estado da embalagem ao receber</li>
</ul>

<p>Dúvidas? <a href="{{support_url}}">Contate nosso suporte</a></p>
```

---

## 📧 Email 6: Review Request

**Assunto:** Sua opinião importa! Deixe uma avaliação 🌟

```html
<h2>Olá {{first_name}}!</h2>

<p>Esperamos que você esteja adorando sua {{product_name}}!</p>

<p>Sua opinião é muito importante para nós e para outros clientes. Que tal compartilhar sua experiência?</p>

<div style="background: #fff3e0; padding: 20px; border-radius: 5px; margin: 20px 0; text-align: center;">
  <h3>Deixe uma Avaliação ⭐</h3>
  <p>Leve apenas 2 minutos!</p>
  <a href="{{review_url}}" class="button">Avaliar Produto</a>
</div>

<h3>O Que Você Pode Compartilhar:</h3>
<ul>
  <li>⭐ Sua classificação (1-5 estrelas)</li>
  <li>📝 Um comentário sobre sua experiência</li>
  <li>📸 Fotos do produto em uso (opcional)</li>
</ul>

<h3>Ganhe Pontos! 🎁</h3>
<p>Ao deixar uma avaliação, você ganha <strong>50 pontos</strong> de bônus!</p>

<a href="{{review_url}}" class="button">Deixar Avaliação</a>

<p style="font-size: 12px; color: #999;">Avaliações verificadas ajudam outros clientes a tomar melhores decisões.</p>
```

---

## 📧 Email 7: Loyalty Program

**Assunto:** {{first_name}}, você subiu de nível! 🏆

```html
<h2>Parabéns, {{first_name}}!</h2>

<p>Você acaba de atingir o nível <strong>{{new_tier}}</strong> do nosso Programa de Lealdade!</p>

<div style="background: linear-gradient(135deg, #d4a574 0%, #8b6f47 100%); color: white; padding: 30px; border-radius: 5px; margin: 20px 0; text-align: center;">
  <h2>{{new_tier_emoji}} {{new_tier}} {{new_tier_emoji}}</h2>
  <p>Você acumulou {{total_points}} pontos!</p>
</div>

<h3>Seus Novos Benefícios:</h3>
<ul>
  {{#tier_benefits}}
  <li>✅ {{benefit}}</li>
  {{/tier_benefits}}
</ul>

<h3>Seus Pontos:</h3>
<div style="background: #f9f9f9; padding: 20px; border-radius: 5px;">
  <p><strong>Pontos Disponíveis:</strong> {{available_points}}</p>
  <p><strong>Pontos Pendentes:</strong> {{pending_points}}</p>
  <p><strong>Total Acumulado:</strong> {{total_points}}</p>
</div>

<h3>Como Usar Seus Pontos:</h3>
<ul>
  <li>💰 Desconto em compras futuras (100 pontos = R$ 10)</li>
  <li>🎁 Produtos grátis (500 pontos = Faca de Manteiga)</li>
  <li>🚚 Frete grátis (200 pontos)</li>
  <li>⭐ Acesso exclusivo a novos produtos</li>
</ul>

<a href="{{loyalty_url}}" class="button">Resgatar Pontos</a>

<p>Continue comprando e desbloqueando novos benefícios!</p>
```

---

## 📧 Email 8: Referral Program

**Assunto:** Convide amigos e ganhe R$ 50! 💰

```html
<h2>Olá {{first_name}}!</h2>

<p>Quer ganhar dinheiro enquanto compartilha suas facas favoritas?</p>

<p>Apresente a CACHA-A-CUTELARIA para seus amigos e ganhe <strong>R$ 50 de crédito</strong> para cada amigo que fizer uma compra!</p>

<div style="background: #c8e6c9; padding: 20px; border-radius: 5px; margin: 20px 0;">
  <h3>Seu Código de Referral:</h3>
  <p style="font-size: 24px; font-weight: bold; text-align: center; color: #2e7d32;">{{referral_code}}</p>
  <p style="text-align: center; font-size: 12px; color: #666;">Copie e compartilhe com seus amigos</p>
</div>

<h3>Como Funciona:</h3>
<ol>
  <li>Compartilhe seu código de referral: <strong>{{referral_code}}</strong></li>
  <li>Seu amigo usa o código ao fazer a primeira compra</li>
  <li>Você ganha R$ 50 de crédito automaticamente</li>
  <li>Seu amigo ganha 10% de desconto também!</li>
</ol>

<h3>Seu Histórico de Referrals:</h3>
<div style="background: #f9f9f9; padding: 20px; border-radius: 5px;">
  <p><strong>Referrals Bem-Sucedidos:</strong> {{successful_referrals}}</p>
  <p><strong>Crédito Ganho:</strong> R$ {{referral_earnings}}</p>
  <p><strong>Crédito Disponível:</strong> R$ {{available_credit}}</p>
</div>

<h3>Formas de Compartilhar:</h3>
<p>
  <a href="https://www.facebook.com/sharer/sharer.php?u={{share_url}}&quote=Confira a CACHA-A-CUTELARIA! Use meu código {{referral_code}} para 10% de desconto">Facebook</a> | 
  <a href="https://twitter.com/intent/tweet?text=Adorei as facas da CACHA-A-CUTELARIA! Use {{referral_code}} para 10% de desconto&url={{share_url}}">Twitter</a> | 
  <a href="https://api.whatsapp.com/send?text=Confira a CACHA-A-CUTELARIA! Use {{referral_code}} para 10% de desconto {{share_url}}">WhatsApp</a>
</p>

<a href="{{referral_url}}" class="button">Gerenciar Referrals</a>
```

---

## 📧 Email 9: Newsletter

**Assunto:** Novidades da CACHA-A-CUTELARIA - Edição {{month}}/{{year}}

```html
<h2>Olá {{first_name}}!</h2>

<p>Bem-vindo à newsletter de {{month}}! Confira as novidades:</p>

<h3>🆕 Novos Produtos</h3>
<p>Lançamos 3 novas facas artesanais este mês:</p>
{{#new_products}}
<div style="background: #f9f9f9; padding: 15px; margin: 10px 0; border-radius: 5px;">
  <strong>{{product_name}}</strong><br>
  {{product_description}}<br>
  <a href="{{product_url}}">Ver Detalhes →</a>
</div>
{{/new_products}}

<h3>📚 Artigos Úteis</h3>
<ul>
  {{#articles}}
  <li><a href="{{article_url}}">{{article_title}}</a></li>
  {{/articles}}
</ul>

<h3>⭐ Destaque da Comunidade</h3>
<p>Este mês, o cliente {{featured_customer}} compartilhou uma incrível receita usando nossa Faca de Chef:</p>
<p><em>"{{featured_review}}"</em></p>
<a href="{{community_url}}">Ver Mais Histórias →</a>

<h3>🎁 Promoção Especial</h3>
<p>Aproveite <strong>15% de desconto</strong> em toda a coleção com o código: <strong>NEWSLETTER15</strong></p>
<p style="font-size: 12px; color: #999;">Válido até {{promo_end_date}}</p>

<a href="{{store_url}}" class="button">Aproveitar Desconto</a>

<p>Até a próxima edição!<br>
<strong>Equipe CACHA-A-CUTELARIA</strong></p>
```

---

## 🎯 Automações de Email

### Fluxo 1: Welcome Series (5 emails)
- Email 1: Welcome + 10% discount (imediato)
- Email 2: Best sellers (1 dia depois)
- Email 3: Educational content (3 dias depois)
- Email 4: Customer stories (5 dias depois)
- Email 5: Referral program (7 dias depois)

### Fluxo 2: Abandoned Cart
- Email 1: Lembrete (1 hora depois)
- Email 2: Incentivo (24 horas depois)
- Email 3: Urgência (48 horas depois)

### Fluxo 3: Post-Purchase
- Email 1: Order confirmation (imediato)
- Email 2: Shipment notification (quando enviado)
- Email 3: Delivery confirmation (quando entregue)
- Email 4: Review request (3 dias depois)
- Email 5: Upsell (7 dias depois)

### Fluxo 4: Loyalty Progression
- Email quando atinge novo tier
- Email com benefícios do novo tier
- Email com oportunidades de resgate

---

## 📊 Métricas de Email

| Métrica | Target |
|---|---|
| Open Rate | > 25% |
| Click Rate | > 5% |
| Conversion Rate | > 2% |
| Unsubscribe Rate | < 0.5% |
| Bounce Rate | < 2% |

---

**Status:** 🟢 **TEMPLATES PRONTOS PARA USO**

---

**Desenvolvido com ❤️ pelo Super Prompt Autônomo**

**Data:** 2024 | **Versão:** 1.0
