### Documentação de Implementação Frontend: Integração Instagram no PSD Billing UI

Este documento detalha como o frontend do PSD Billing UI (`psd-billing-master`) deve consumir os dados da API do Instagram que foram injetados no backend. Uma vez que o backend esteja atualizado e as variáveis de ambiente configuradas, o frontend poderá exibir informações de perfis e métricas de engajamento.

#### 1. Visão Geral da Integração

O backend do PSD Billing UI agora expõe dois novos endpoints tRPC para o Instagram:

*   `instagram.getProfile({ username: string })`: Retorna dados de um perfil do Instagram (seguidores, posts, biografia, etc.).
*   `instagram.getEngagementMetrics({ businessAccountId: string })`: Retorna métricas de engajamento para uma conta comercial.

#### 2. Consumo dos Endpoints no Frontend (Exemplo com React Query e tRPC)

Assumindo que o frontend utiliza React e `@tanstack/react-query` com `@trpc/react-query`, o consumo dos dados seria similar ao seguinte:

##### a. Busca de Perfil do Instagram

Para exibir informações de um perfil (ex: em uma nova página `InstagramInsights.tsx`):

```typescript
import React, { useState } from 'react';
import { trpc } from '../utils/trpc'; // Seu cliente tRPC

const InstagramProfileSearch: React.FC = () => {
  const [username, setUsername] = useState('');
  const { data: profile, isLoading, error, refetch } = trpc.instagram.getProfile.useQuery(
    { username },
    { enabled: false } // Desabilita a query inicialmente
  );

  const handleSearch = () => {
    if (username) {
      refetch();
    }
  };

  return (
    <div>
      <h1>Buscar Perfil do Instagram</h1>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Nome de usuário do Instagram"
      />
      <button onClick={handleSearch} disabled={isLoading}>
        {isLoading ? 'Buscando...' : 'Buscar'}
      </button>

      {error && <p style={{ color: 'red' }}>Erro: {error.message}</p>}

      {profile && (
        <div>
          <h2>@{profile.username}</h2>
          <p>Seguidores: {profile.followersCount}</p>
          <p>Posts: {profile.mediaCount}</p>
          <p>Biografia: {profile.biography}</p>
          {/* Adicione mais campos conforme necessário */}
        </div>
      )}
    </div>
  );
};

export default InstagramProfileSearch;
```

##### b. Exibição de Métricas de Engajamento

Para exibir métricas de engajamento (ex: em um dashboard):

```typescript
import React from 'react';
import { trpc } from '../utils/trpc'; // Seu cliente tRPC

interface InstagramMetricsProps {
  businessAccountId: string;
}

const InstagramMetrics: React.FC<InstagramMetricsProps> = ({ businessAccountId }) => {
  const { data: metrics, isLoading, error } = trpc.instagram.getEngagementMetrics.useQuery(
    { businessAccountId },
    { enabled: !!businessAccountId } // Habilita a query se o ID for fornecido
  );

  if (isLoading) return <p>Carregando métricas...</p>;
  if (error) return <p style={{ color: 'red' }}>Erro ao carregar métricas: {error.message}</p>;
  if (!metrics) return null;

  return (
    <div>
      <h3>Métricas de Engajamento</h3>
      <p>Engajamento: {metrics.engagement}</p>
      <p>Impressões: {metrics.impressions}</p>
      {/* Adicione mais métricas conforme necessário */}
    </div>
  );
};

export default InstagramMetrics;
```

#### 3. Considerações de UI/UX

*   **Navegação:** Adicionar um item de menu ou uma aba no PSD Billing UI para "Instagram Insights" ou "Análise Social".
*   **Componentes:** Reutilizar componentes existentes do PSD Billing UI (inputs, botões, cards) para manter a consistência visual.
*   **Tratamento de Erros:** Implementar feedback visual claro para estados de carregamento, erros e dados vazios.
*   **Autenticação:** Garantir que o frontend lide com a autenticação do usuário e que apenas usuários autorizados possam acessar esses dados.

#### 4. Próximos Passos no Frontend

1.  **Criar Páginas/Componentes:** Desenvolver os componentes React necessários para exibir os dados do Instagram.
2.  **Integrar com o Cliente tRPC:** Conectar os componentes aos novos endpoints tRPC.
3.  **Adicionar Navegação:** Incluir links ou abas na interface do usuário para acessar as novas funcionalidades.
4.  **Testes:** Realizar testes de integração no frontend para garantir que os dados sejam exibidos corretamente.

Este documento serve como um guia para a equipe de frontend. A implementação real dependerá da resolução do problema de autenticação do GitHub e do redeploy do backend com as novas rotas do Instagram ativas.
