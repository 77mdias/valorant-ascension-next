# 📋 CRUD e Sistema de Roles - Valorant Academy

## 🎯 Visão Geral

Este documento detalha o sistema completo de CRUD (Create, Read, Update, Delete) e controle de acesso baseado em roles (RBAC) da aplicação Valorant Academy. O sistema foi projetado com segurança em camadas e separação clara de responsabilidades.

## 🔐 Sistema de Roles (RBAC)

### Roles Disponíveis

```typescript
enum UserRole {
  CUSTOMER     // Cliente padrão - acesso limitado
  ADMIN        // Administrador - acesso total ao dashboard
  PROFESSIONAL // Profissional/Instrutor - criação de conteúdo
}
```

### Hierarquia de Permissões

| Funcionalidade | CUSTOMER | PROFESSIONAL | ADMIN |
|----------------|----------|--------------|-------|
| Visualizar cursos | ✅ | ✅ | ✅ |
| Acessar dashboard | ❌ | ⚠️ | ✅ |
| Gerenciar usuários | ❌ | ❌ | ✅ |
| Criar/editar aulas | ❌ | ✅ | ✅ |
| Configurações sistema | ❌ | ❌ | ✅ |

> ⚠️ PROFESSIONAL terá acesso limitado ao dashboard (futuro)

## 🛡️ Camadas de Segurança

### 1. Middleware (Primeira Camada)
```typescript
// middleware.ts
export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isDashboardPage = req.nextUrl.pathname.startsWith("/dashboard");
    
    // Proteger páginas do dashboard - só admins podem acessar
    if (isDashboardPage && (!isAuth || token?.role !== "ADMIN")) {
      const signInUrl = new URL("/auth/signin", req.url);
      signInUrl.searchParams.set("error", "AccessDenied");
      return NextResponse.redirect(signInUrl);
    }
  }
);
```

**Rotas Protegidas:**
- `/dashboard/*` - Apenas ADMIN
- `/admin/*` - Apenas ADMIN
- `/auth/*` - Controle de autenticação

### 2. Layout/Page Level (Segunda Camada)
```typescript
// src/app/dashboard/layout.tsx
export default async function DashboardLayout({ children }) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect('/auth/signin');
  }

  // Verificar se o usuário é ADMIN
  const user = session.user as any;
  if (user?.role !== UserRole.ADMIN) {
    redirect('/auth/signin?error=AccessDenied');
  }
  
  return <div>{children}</div>;
}
```

### 3. Server Actions (Terceira Camada)
```typescript
// src/server/userActions.ts
export async function deleteUser(id: string) {
  // TODO: Adicionar verificação de role aqui
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'ADMIN') {
    throw new Error('Unauthorized');
  }
  
  await db.user.delete({ where: { id } });
  revalidatePath("/dashboard/users");
}
```

### 4. Hook Client-Side (Quarta Camada)
```typescript
// src/hooks/useAuth.ts
export function useAuth() {
  const { data: session, status } = useSession();
  const user = session?.user as UserWithRole | undefined;

  return {
    user,
    isLoading: status === "loading",
    isAuthenticated: !!user,
    isAdmin: user?.role === UserRole.ADMIN,
    isSeller: user?.role === UserRole.PROFESSIONAL,
    isCustomer: user?.role === UserRole.CUSTOMER,
  };
}
```

## 📊 Estrutura CRUD

### 1. Entidades Principais

#### **Users (Usuários)**
- **Schema**: `/src/schemas/userSchemas.ts`
- **Actions**: `/src/server/userActions.ts`
- **Interface**: `/src/app/dashboard/users/page.tsx`
- **Componente**: `/src/components/forms/UserForm.tsx`

#### **Lessons (Aulas)**
- **Schema**: `/src/schemas/lessonSchemas.ts`
- **Actions**: `/src/server/lessonActions.ts`
- **Interface**: `/src/app/dashboard/lessons/page.tsx`
- **Componente**: `/src/components/forms/LessonForm.tsx`

#### **Categories (Categorias)**
- **Schema**: `/src/schemas/categorySchemas.ts`
- **Actions**: `/src/server/categoryActions.ts`
- **Interface**: `/src/app/dashboard/categories/page.tsx`
- **Componente**: `/src/components/forms/CategoryForm.tsx`

### 2. Padrão de Operações CRUD

#### **CREATE (Criar)**
```typescript
export async function createUser(raw: unknown) {
  // 1. Validação com Zod
  const data = UserInput.parse(raw);
  
  // 2. Processamento (ex: hash senha)
  let password: string | undefined = undefined;
  if (data.password) {
    password = await hash(data.password, 12);
  }
  
  // 3. Operação no banco
  const user = await db.user.create({
    data: {
      branchId: data.branchId,
      nickname: data.nickname,
      role: data.role,
      email: data.email,
      password,
      isActive: data.isActive ?? false,
    }
  });
  
  // 4. Revalidação do cache
  revalidatePath("/dashboard/users");
  
  // 5. Retorno padronizado
  return { success: true, data: user };
}
```

#### **READ (Ler)**
```typescript
export async function listUsers() {
  try {
    const users = await db.user.findMany({
      select: {
        id: true,
        branchId: true,
        nickname: true,
        role: true,
        email: true,
        isActive: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' }
    });
    
    return { success: true, data: users };
  } catch (error) {
    return { success: false, error: 'Erro ao buscar usuários' };
  }
}
```

#### **UPDATE (Atualizar)**
```typescript
export async function updateUser(raw: unknown) {
  // 1. Validação específica para update
  const { id, ...data } = UserUpdateInput.parse(raw);
  
  // 2. Processamento condicional
  const updateData: any = { ...data };
  if (data.password) {
    updateData.password = await hash(data.password, 12);
  }
  
  // 3. Operação no banco
  const user = await db.user.update({
    where: { id },
    data: updateData
  });
  
  // 4. Revalidação
  revalidatePath("/dashboard/users");
  
  return { success: true, data: user };
}
```

#### **DELETE (Deletar)**
```typescript
export async function deleteUser(id: string) {
  try {
    await db.user.delete({
      where: { id }
    });
    
    revalidatePath("/dashboard/users");
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Erro ao deletar usuário' };
  }
}
```

## 🔧 Componentes e Formulários

### 1. Estrutura de Formulários

```typescript
// src/components/forms/UserForm.tsx
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserInput, UserInputType } from "@/schemas/userSchemas";
import { createUser, updateUser } from "@/server/userActions";
import { toast } from "@/components/ui/use-toast";

interface UserFormProps {
  initialData?: UserInputType;
  onSuccess?: () => void;
}

export default function UserForm({ initialData, onSuccess }: UserFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  
  const form = useForm<UserInputType>({
    resolver: zodResolver(UserInput),
    defaultValues: initialData || {
      branchId: "",
      nickname: "",
      email: "",
      role: "CUSTOMER",
      isActive: false,
    },
  });

  const onSubmit = async (data: UserInputType) => {
    setIsLoading(true);
    try {
      const result = initialData 
        ? await updateUser({ ...data, id: initialData.id })
        : await createUser(data);
        
      if (result.success) {
        toast({ title: "Sucesso!", description: "Usuário salvo com sucesso" });
        onSuccess?.();
      }
    } catch (error) {
      toast({ title: "Erro", description: "Erro ao salvar usuário" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      {/* Campos do formulário */}
    </form>
  );
}
```

### 2. Validação com Zod

```typescript
// src/schemas/userSchemas.ts
import { z } from "zod";
import { UserRole } from "@prisma/client";

export const UserInput = z.object({
  branchId: z.string().min(1, "Branch ID é obrigatório"),
  nickname: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres").optional(),
  role: z.nativeEnum(UserRole),
  isActive: z.boolean().optional(),
});

export type UserInputType = z.infer<typeof UserInput>;
```

## 🎨 Interface do Dashboard

### 1. Layout Principal
```
/dashboard
├── layout.tsx          # Sidebar + Header + Proteção
├── page.tsx            # Dashboard principal
├── /users
│   ├── page.tsx        # Lista de usuários
│   └── [id]/
│       └── page.tsx    # Editar usuário
├── /lessons
│   ├── page.tsx        # Lista de aulas
│   └── [id]/
│       └── page.tsx    # Editar aula
└── /categories
    ├── page.tsx        # Lista de categorias
    └── [id]/
        └── page.tsx    # Editar categoria
```

### 2. Componentes de Navegação

#### **Sidebar Navigation**
```typescript
// src/app/dashboard/layout.tsx
<nav className={styles.navigation}>
  <div className={styles.navSection}>
    <h3>Gerenciamento</h3>
    <ul>
      <li><Link href="/dashboard/users">👤 Usuários</Link></li>
      <li><Link href="/dashboard/lessons">📝 Aulas</Link></li>
      <li><Link href="/dashboard/categories">📁 Categorias</Link></li>
    </ul>
  </div>
</nav>
```

#### **Header com Info do Usuário**
```typescript
<header className={styles.header}>
  <div className={styles.profileSection}>
    <div className={styles.userInfo}>
      <span>{session.user?.name}</span>
      <span>{session.user?.email}</span>
    </div>
  </div>
</header>
```

### 3. Tabelas de Dados

```typescript
// Exemplo de tabela de usuários
<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Nome</TableHead>
      <TableHead>Email</TableHead>
      <TableHead>Role</TableHead>
      <TableHead>Status</TableHead>
      <TableHead>Ações</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {users?.map((user) => (
      <TableRow key={user.id}>
        <TableCell>{user.nickname}</TableCell>
        <TableCell>{user.email}</TableCell>
        <TableCell>
          <Badge variant={user.role === 'ADMIN' ? 'default' : 'secondary'}>
            {user.role}
          </Badge>
        </TableCell>
        <TableCell>
          <Badge variant={user.isActive ? 'success' : 'destructive'}>
            {user.isActive ? 'Ativo' : 'Inativo'}
          </Badge>
        </TableCell>
        <TableCell>
          <Button onClick={() => handleEdit(user)}>Editar</Button>
          <Button onClick={() => handleDelete(user.id)} variant="destructive">
            Deletar
          </Button>
        </TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
```

## 🚀 Fluxo de Operações

### 1. Fluxo CREATE
```
1. Usuário clica "Novo Usuário"
2. Modal/Form é aberto
3. Usuário preenche dados
4. Form valida com Zod
5. Submit chama createUser server action
6. Server action valida novamente
7. Dados são salvos no banco
8. revalidatePath atualiza o cache
9. UI é atualizada automaticamente
10. Toast de sucesso é exibido
```

### 2. Fluxo READ
```
1. Página carrega
2. Server component chama listUsers
3. Dados são buscados do banco
4. HTML é renderizado no servidor
5. Cliente recebe página completa
6. Tabela é exibida com dados
```

### 3. Fluxo UPDATE
```
1. Usuário clica "Editar"
2. Form é preenchido com dados existentes
3. Usuário modifica campos
4. Submit chama updateUser server action
5. Server action valida e atualiza banco
6. revalidatePath atualiza cache
7. UI reflete mudanças
8. Toast de sucesso
```

### 4. Fluxo DELETE
```
1. Usuário clica "Deletar"
2. Confirmação é solicitada
3. deleteUser server action é chamada
4. Registro é removido do banco
5. revalidatePath atualiza cache
6. Item desaparece da tabela
7. Toast de confirmação
```

## 🔄 Estado e Sincronização

### 1. Cache Management
```typescript
// Revalidação automática após mutações
revalidatePath("/dashboard/users");    // Específica
revalidateTag("users");               // Por tag
router.refresh();                     // Manual no cliente
```

### 2. Optimistic Updates (Futuro)
```typescript
// Para melhor UX
const optimisticUsers = useOptimistic(users, (state, newUser) => [
  ...state,
  newUser
]);
```

## 📱 Responsividade

### 1. Layout Adaptativo
```scss
// Dashboard responsive
.dashboardContainer {
  @media (max-width: 768px) {
    .sidebar {
      transform: translateX(-100%);
      &.open {
        transform: translateX(0);
      }
    }
  }
}
```

### 2. Tabelas Mobile
```typescript
// Tabelas colapsáveis em mobile
<div className="hidden md:block">
  <Table>...</Table>
</div>
<div className="md:hidden">
  <CardList users={users} />
</div>
```

## 🧪 Testes (Planejados)

### 1. Testes de Server Actions
```typescript
// __tests__/userActions.test.ts
describe('User Actions', () => {
  it('should create user with valid data', async () => {
    const userData = {
      branchId: 'test',
      nickname: 'Test User',
      email: 'test@test.com',
      role: 'CUSTOMER'
    };
    
    const result = await createUser(userData);
    expect(result.success).toBe(true);
  });
});
```

### 2. Testes de Componentes
```typescript
// __tests__/UserForm.test.tsx
describe('UserForm', () => {
  it('should validate required fields', async () => {
    render(<UserForm />);
    fireEvent.click(screen.getByText('Salvar'));
    expect(screen.getByText('Nome é obrigatório')).toBeInTheDocument();
  });
});
```

## 🛠️ Próximas Melhorias

### 1. Funcionalidades
- [ ] **Filtros avançados** nas tabelas
- [ ] **Paginação** para grandes datasets
- [ ] **Busca global** no dashboard
- [ ] **Export de dados** (CSV, PDF)
- [ ] **Auditoria** de ações dos usuários
- [ ] **Notificações** em tempo real

### 2. Segurança
- [ ] **Rate limiting** nas server actions
- [ ] **Logs de auditoria** para ações sensíveis
- [ ] **2FA** para usuários admin
- [ ] **Sessões múltiplas** controle

### 3. Performance
- [ ] **Infinite scroll** para tabelas grandes
- [ ] **Virtual scrolling** para listas extensas
- [ ] **Cache Redis** para dados frequentes
- [ ] **Debounce** em buscas

### 4. UX/UI
- [ ] **Modo escuro** completo
- [ ] **Atalhos de teclado** para ações rápidas
- [ ] **Drag & drop** para reordenação
- [ ] **Bulk operations** (ações em lote)

## 📚 Recursos Técnicos

### Dependências Principais
- **Next.js 14+** - App Router
- **Prisma** - ORM e migrations
- **NextAuth.js** - Autenticação
- **Zod** - Validação
- **React Hook Form** - Forms
- **Tailwind CSS** - Styling
- **TypeScript** - Type safety

### Estrutura de Arquivos
```
src/
├── app/
│   ├── dashboard/        # Páginas admin
│   └── api/auth/        # Rotas de autenticação
├── components/
│   ├── forms/           # Formulários CRUD
│   ├── ui/              # Componentes base
│   └── dashboard/       # Componentes específicos
├── hooks/
│   └── useAuth.ts       # Hook de autenticação
├── lib/
│   ├── auth.ts          # Configuração NextAuth
│   └── prisma.ts        # Cliente Prisma
├── schemas/             # Validações Zod
├── server/              # Server Actions
└── types/               # Tipos TypeScript
```

---

**Última atualização:** 10 de setembro de 2025  
**Versão:** 1.0.0  
**Autor:** Sistema de Documentação Valorant Academy
