# 2025-09-10 – Dashboard CRUD para Valorant Academy

## Problema
Criar uma interface administrativa completa para gerenciar usuários, aulas e categorias de aulas no sistema Valorant Academy, com operações CRUD e visualização organizada dos dados.

## Solução
Implementação de um dashboard completo utilizando:
- Layout com sidebar e header para navegação
- Páginas específicas para cada entidade (users, lessons, lessonCategories)
- Tabelas com visualização de dados e ações
- Formulários para criação e edição
- Server Actions para operações CRUD
- Validação com Zod
- Estilização usando Tailwind e SCSS Modules

## Padrões Utilizados
1. **Componentes Reutilizáveis**: Formulários e tabelas que podem ser usados em múltiplos contextos.
2. **Server Components + Client Components**: Uso adequado de cada um conforme necessidade de interatividade.
3. **Server Actions**: Para operações CRUD com validação e tipagem forte.
4. **SCSS Modules**: Para estilos isolados e organizados por componente/página.
5. **Separação de Responsabilidades**: Schemas separados das ações e componentes.
6. **Tratamento de Erros**: Toast notifications para feedback ao usuário.
7. **RBAC (Role-Based Access Control)**: Estrutura para diferentes permissões de usuário.

## Termos para Estudo
- **Server Actions**: Funções executadas no servidor para mutações de dados no Next.js App Router.
- **RBAC (Role-Based Access Control)**: Controle de acesso baseado em funções/papéis de usuário.
- **Optimistic Updates**: Atualizações na UI antes da confirmação do servidor para melhor UX.
- **React Server Components**: Componentes renderizados no servidor para melhor performance e SEO.
- **Zod**: Biblioteca para validação e tipagem de dados em TypeScript.

## Próximos Passos
1. **Implementar filtros e ordenação** nas tabelas para melhor gerenciamento de dados.
2. **Adicionar paginação** para lidar com grande volume de registros.
3. **Melhorar RBAC** implementando proteção nas rotas e ações específicas por função.
4. **Adicionar testes** para garantir estabilidade dos formulários e operações CRUD.
5. **Implementar upload de imagens** para thumbnails de aulas e avatares de usuário.
6. **Adicionar modo claro/escuro** para melhor experiência do usuário.
7. **Implementar relatórios** e visualizações de dados para métricas importantes.
