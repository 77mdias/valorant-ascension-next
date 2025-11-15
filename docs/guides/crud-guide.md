# Guia de CRUD do Dashboard - Valorant Academy

Este documento serve como um guia completo para entender e trabalhar com o CRUD (Create, Read, Update, Delete) implementado no dashboard do Valorant Academy.

## 📚 Índice

- [Visão Geral](#visão-geral)
- [Estrutura de Arquivos](#estrutura-de-arquivos)
- [Fluxo de Dados](#fluxo-de-dados)
- [Implementação de Entidades](#implementação-de-entidades)
  - [Usuários](#usuários)
  - [Categorias de Aulas](#categorias-de-aulas)
  - [Aulas](#aulas)
- [Schemas e Validação](#schemas-e-validação)
- [Server Actions](#server-actions)
- [Formulários](#formulários)
- [Componentes Reutilizáveis](#componentes-reutilizáveis)
- [Estilos e UI](#estilos-e-ui)
- [Considerações de Segurança](#considerações-de-segurança)
- [Extensões e Melhorias](#extensões-e-melhorias)

## Visão Geral

O dashboard do Valorant Academy é uma interface de administração completa para gerenciar usuários, aulas e suas categorias. Ele foi construído seguindo os princípios de:

- **Modularidade**: Componentes e estilos reutilizáveis
- **Separação de Responsabilidades**: UI, validação e lógica de negócios separadas
- **Tipagem Forte**: TypeScript em todo o projeto
- **Feedback ao usuário**: Notificações para todas as operações
- **Segurança**: Validação de entrada em todos os níveis

## Estrutura de Arquivos

```
src/
  app/
    dashboard/
      layout.tsx                # Layout compartilhado do dashboard
      page.tsx                  # Página principal do dashboard
      scss/
        Dashboard.module.scss   # Estilos globais do dashboard
      users/
        page.tsx                # Página CRUD de usuários
        scss/
          UsersPage.module.scss # Estilos específicos de usuários
      categories/
        page.tsx                # Página CRUD de categorias
        scss/
          CategoriesPage.module.scss # Estilos específicos de categorias
      lessons/
        page.tsx                # Página CRUD de aulas
        scss/
          LessonsPage.module.scss # Estilos específicos de aulas
  components/
    forms/
      UserForm.tsx              # Formulário de usuários
      LessonCategoryForm.tsx    # Formulário de categorias
      LessonForm.tsx            # Formulário de aulas
  schemas/
    user.ts                     # Schemas Zod para usuários
    lessonCategory.ts           # Schemas Zod para categorias
    lesson.ts                   # Schemas Zod para aulas
  server/
    userActions.ts              # Server actions para usuários
    lessonCategoryActions.ts    # Server actions para categorias
    lessonsActions.ts           # Server actions para aulas
```

## Fluxo de Dados

O CRUD segue o seguinte fluxo de dados:

1. **Cliente**: O usuário interage com os formulários e tabelas na interface
2. **Validação Cliente**: React Hook Form + Zod validam os dados no cliente
3. **Submissão**: Os dados são enviados para o servidor via Server Actions
4. **Validação Servidor**: Os dados são revalidados no servidor usando Zod
5. **Persistência**: Os dados são persistidos no banco de dados usando Prisma
6. **Resposta**: O servidor retorna sucesso/erro e os dados atualizados
7. **UI Update**: A interface é atualizada com os novos dados ou mensagens de erro

Este fluxo garante consistência e segurança em todas as operações.

## Implementação de Entidades

### Usuários

**Modelo**:
```typescript
model user {
  id                       String              @id @default(uuid())
  branchId                 String
  nickname                 String
  role                     UserRole            @default(CUSTOMER)
  email                    String              @unique
  password                 String?
  isActive                 Boolean             @default(false)
  // outros campos...
}
```

**Operações**:
- **Criar**: Novo usuário com validação de email único e hash de senha
- **Listar**: Todos os usuários com filtro de busca
- **Editar**: Atualiza dados e opcionalmente a senha (hasheia apenas se fornecida)
- **Excluir**: Remove usuário (com confirmação)

**Campos Importantes**:
- `role`: Define permissões (CUSTOMER, PROFESSIONAL, ADMIN)
- `isActive`: Controla se o usuário pode fazer login
- `branchId`: Identifica a filial do usuário

### Categorias de Aulas

**Modelo**:
```typescript
model lessonCategory {
  id          String      @id @default(uuid())
  name        String
  description String?
  icon        String?
  level       LessonLevel @default(INICIANTE)
  slug        String      @unique @default("default-slug")
  lessons     lessons[]
}
```

**Operações**:
- **Criar**: Nova categoria com geração automática de slug
- **Listar**: Todas as categorias com contagem de aulas relacionadas
- **Editar**: Atualiza dados mantendo relações
- **Excluir**: Remove categoria (apenas se não tiver aulas vinculadas)

**Campos Importantes**:
- `level`: Nível de dificuldade da categoria
- `slug`: URL amigável automaticamente gerada do nome
- `lessons`: Relação com aulas

### Aulas

**Modelo**:
```typescript
model lessons {
  id           String              @id @default(uuid())
  title        String
  description  String?
  categoryId   String
  videoUrl     String?
  thumbnailUrl String?
  isLive       Boolean             @default(false)
  // outros campos...
  category     lessonCategory      @relation(fields: [categoryId], references: [id])
}
```

**Operações**:
- **Criar**: Nova aula vinculada a uma categoria
- **Listar**: Todas as aulas com informações da categoria
- **Editar**: Atualiza dados e pode mudar categoria
- **Excluir**: Remove aula

**Campos Importantes**:
- `categoryId`: Vincula a aula a uma categoria
- `isLive`: Define se a aula é ao vivo
- `videoUrl`: Link para o vídeo da aula
- `thumbnailUrl`: Imagem de preview da aula

## Schemas e Validação

Todos os dados são validados usando Zod, tanto no cliente quanto no servidor. Exemplos:

**UserSchema**:
```typescript
export const UserSchema = z.object({
  nickname: z.string().min(2, "Nickname deve ter pelo menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
  role: z.enum(["ADMIN", "CUSTOMER", "PROFESSIONAL"]).optional(),
  isActive: z.boolean().optional(),
  branchId: z.string().optional(),
});
```

**LessonCategorySchema**:
```typescript
export const LessonCategorySchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  description: z.string().optional(),
  icon: z.string().optional(),
  level: z.enum(["INICIANTE", "INTERMEDIARIO", "AVANCADO", "IMORTAL"]).optional(),
  slug: z.string().min(2, "Slug deve ter pelo menos 2 caracteres"),
});
```

**LessonSchema**:
```typescript
export const LessonSchema = z.object({
  title: z.string().min(2, "Título deve ter pelo menos 2 caracteres"),
  description: z.string().min(10, "Descrição deve ter pelo menos 10 caracteres"),
  content: z.string().optional(),
  videoUrl: z.string().url("URL do vídeo inválida").optional(),
  thumbnailUrl: z.string().url("URL da thumbnail inválida").optional(),
  duration: z.number().int().min(0).optional(),
  categoryId: z.string().uuid("ID da categoria inválido"),
});
```

## Server Actions

As Server Actions são responsáveis por lidar com as operações CRUD no lado do servidor. Elas utilizam Prisma para interagir com o banco de dados e retornam respostas tipadas.

Exemplo de Server Action (criação de usuário):

```typescript
export async function createUser(raw: unknown) {
  const data = UserInput.parse(raw);
  // Hash da senha se fornecida
  let password: string | undefined = undefined;
  if (data.password) {
    password = await hash(data.password, 12);
  }
  const user = await db.user.create({
    data: {
      branchId: data.branchId,
      nickname: data.nickname,
      role: data.role,
      email: data.email,
      password,
      isActive: data.isActive ?? false,
    },
    select: {
      id: true,
      branchId: true,
      nickname: true,
      role: true,
      email: true,
      isActive: true,
      createdAt: true,
    },
  });
  revalidatePath("/dashboard/users");
  return { success: true, data: user };
}
```

Pontos importantes:
- Validação dos dados de entrada com Zod
- Transformação dos dados quando necessário (hash de senha)
- Seleção específica de campos para retorno (segurança)
- Revalidação de cache para garantir dados atualizados
- Retorno estruturado com status e dados

## Formulários

Os formulários são implementados com React Hook Form e validação Zod. Eles suportam:

- Criação e edição com o mesmo componente
- Validação em tempo real
- Feedback de erro por campo
- Estado de loading durante submissão
- Mensagens de sucesso/erro

Exemplo de uso de formulário:

```tsx
<UserForm 
  initialData={editingUser} // Passa dados para edição ou undefined para criação
  onSuccess={() => {
    setEditingUser(null);
    loadUsers(); // Recarrega a lista após sucesso
  }} 
/>
```

## Componentes Reutilizáveis

O dashboard utiliza vários componentes reutilizáveis do shadcn/ui, incluindo:

- `Table`, `TableHeader`, `TableRow`, etc. para exibir dados
- `Card` para containers de conteúdo
- `Button` para ações
- `Input`, `Select`, `Switch` para formulários
- `toast` para notificações

## Estilos e UI

A estilização é feita combinando Tailwind CSS para classes utilitárias e SCSS Modules para estilos mais complexos e específicos de componentes.

Por exemplo:

```tsx
// JSX com Tailwind
<TableRow>
  <TableCell className="font-medium">Título da Aula</TableCell>
</TableRow>

// Combinado com SCSS Module
<div className={styles.lessonTitle}>
  <img src={lesson.thumbnailUrl} className={styles.thumbnailPreview} />
</div>
```

O SCSS Module correspondente:

```scss
.lessonTitle {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.thumbnailPreview {
  width: 40px;
  height: 40px;
  border-radius: 0.25rem;
  object-fit: cover;
}
```

## Considerações de Segurança

- **Validação em Camadas**: Todos os dados são validados no cliente e servidor
- **Verificação de Permissão**: Deve ser implementada em cada server action
- **Sanitização de Saída**: Dados sensíveis não são retornados para o cliente
- **Confirmação de Ações Destrutivas**: Exclusões requerem confirmação do usuário
- **Feedback de Erro**: Mensagens de erro claras sem expor detalhes internos

## Extensões e Melhorias

O sistema CRUD atual pode ser estendido com:

1. **Paginação**: Para lidar com grandes conjuntos de dados
2. **Filtros Avançados**: Por múltiplos campos
3. **Ordenação Customizável**: Por qualquer coluna
4. **Export/Import**: Exportar e importar dados em massa
5. **Histórico de Alterações**: Auditar quem fez quais mudanças
6. **Permissões Granulares**: Por operação ou entidade
7. **Visualização em Modo Tabela/Grade**: Alternar entre visualizações
8. **Lote de Operações**: Editar ou excluir múltiplos itens de uma vez
9. **Pesquisa Global**: Buscar em todas as entidades ao mesmo tempo
10. **Dashboards Analíticos**: Visualizar métricas e tendências

---

## Como Criar Uma Nova Entidade CRUD

Para adicionar uma nova entidade ao dashboard, siga estes passos:

### 1. Defina o Schema Prisma

Adicione seu modelo ao `schema.prisma`:

```prisma
model newEntity {
  id          String   @id @default(uuid())
  name        String
  description String?
  // outros campos...
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

### 2. Crie os Schemas Zod

Crie um arquivo em `src/schemas/newEntity.ts`:

```typescript
import { z } from "zod";

export const NewEntitySchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  description: z.string().optional(),
  // outros campos...
});

export const UpdateNewEntitySchema = NewEntitySchema.partial().extend({
  id: z.string().uuid(),
});

export type NewEntityInput = z.infer<typeof NewEntitySchema>;
export type UpdateNewEntityInput = z.infer<typeof UpdateNewEntitySchema>;
```

### 3. Implemente as Server Actions

Crie um arquivo em `src/server/newEntityActions.ts`:

```typescript
"use server";

import { db } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { NewEntitySchema, UpdateNewEntitySchema } from "@/schemas/newEntity";

export async function createNewEntity(raw: unknown) {
  const data = NewEntitySchema.parse(raw);
  const entity = await db.newEntity.create({ data });
  revalidatePath("/dashboard/new-entities");
  return { success: true, data: entity };
}

export async function updateNewEntity(raw: unknown) {
  const { id, ...data } = UpdateNewEntitySchema.parse(raw);
  const entity = await db.newEntity.update({ 
    where: { id }, 
    data 
  });
  revalidatePath("/dashboard/new-entities");
  return { success: true, data: entity };
}

export async function deleteNewEntity(id: string) {
  await db.newEntity.delete({ where: { id } });
  revalidatePath("/dashboard/new-entities");
  return { success: true };
}

export async function listNewEntities() {
  const entities = await db.newEntity.findMany({
    orderBy: { createdAt: "desc" },
  });
  return { success: true, data: entities };
}

export async function getNewEntityById(id: string) {
  const entity = await db.newEntity.findUnique({ where: { id } });
  if (!entity) {
    return { success: false, error: "Entidade não encontrada" };
  }
  return { success: true, data: entity };
}
```

### 4. Crie o Formulário

Crie um arquivo em `src/components/forms/NewEntityForm.tsx`:

```typescript
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { NewEntityInput, NewEntitySchema } from "@/schemas/newEntity";
import { createNewEntity, updateNewEntity } from "@/server/newEntityActions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";

interface NewEntityFormProps {
  initialData?: Partial<NewEntityInput> & { id?: string };
  onSuccess?: () => void;
}

export default function NewEntityForm({ initialData, onSuccess }: NewEntityFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const isEdit = !!initialData?.id;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<NewEntityInput>({
    resolver: zodResolver(NewEntitySchema),
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
      // outros campos...
    },
  });

  async function onSubmit(data: NewEntityInput) {
    setIsLoading(true);
    
    try {
      let result;
      
      if (isEdit) {
        result = await updateNewEntity({ id: initialData!.id, ...data });
      } else {
        result = await createNewEntity(data);
      }

      if (result.success) {
        toast({
          title: "Sucesso",
          description: isEdit 
            ? "Entidade atualizada com sucesso!" 
            : "Entidade criada com sucesso!",
        });
        onSuccess?.();
      } else {
        toast({
          title: "Erro",
          description: "Erro ao processar solicitação",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro inesperado ao processar solicitação",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Nome *</Label>
        <Input
          id="name"
          {...register("name")}
          disabled={isLoading}
        />
        {errors.name && (
          <p className="text-sm text-red-500">{errors.name.message}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Descrição</Label>
        <Textarea
          id="description"
          {...register("description")}
          disabled={isLoading}
        />
        {errors.description && (
          <p className="text-sm text-red-500">{errors.description.message}</p>
        )}
      </div>
      
      <div className="flex justify-end">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Salvando..." : (isEdit ? "Atualizar" : "Criar")}
        </Button>
      </div>
    </form>
  );
}
```

### 5. Crie a Página do Dashboard

Crie a estrutura:

```bash
mkdir -p src/app/dashboard/new-entities/scss
touch src/app/dashboard/new-entities/page.tsx
touch src/app/dashboard/new-entities/scss/NewEntitiesPage.module.scss
```

E implemente a página em `src/app/dashboard/new-entities/page.tsx` seguindo o padrão das outras páginas CRUD.

### 6. Adicione o Link na Sidebar

Atualize o arquivo `src/app/dashboard/layout.tsx` para incluir o link para a nova entidade na navegação.

---

## Melhores Práticas

1. **Manter consistência**: Siga os mesmos padrões em todas as entidades
2. **Reutilizar componentes**: Extraia lógica comum para componentes reutilizáveis
3. **Validar em camadas**: Sempre valide dados no cliente e no servidor
4. **Fornecer feedback**: Notifique o usuário sobre o resultado de todas as operações
5. **Documentar regras de negócio**: Adicione comentários explicando lógicas complexas
6. **Testar fluxos principais**: Crie testes para os cenários mais importantes
7. **Considerar UX**: Pense na experiência do usuário em cada interação
8. **Otimizar performance**: Evite carregar dados desnecessários
9. **Implementar autorização**: Verifique permissões em todas as operações
10. **Manter tipagem**: Use TypeScript em todo o código para prevenir erros
