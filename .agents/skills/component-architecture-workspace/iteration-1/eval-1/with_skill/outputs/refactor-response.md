### 1. Problems in Architecture

*   **Tightly Coupled Responsibilities:** The `UserProfile` component violates the Single Responsibility Principle by handling data fetching, form state management, and complex UI rendering within a single monolithic file.
*   **Bloated Component:** At 500 lines of JSX, the component is difficult to maintain, test, and understand. This high level of complexity increases the risk of side effects during updates.
*   **Lack of Reusability:** UI primitives embedded directly in the component (like specialized buttons, inputs, or layout wrappers) cannot be easily reused across the application, leading to code duplication.
*   **Mixed Logic and Presentation:** Combining business logic (data fetching and form submission) with presentation logic (JSX) makes the component less declarative and harder to debug.

### 2. Improved Structure

The proposed organization separates concerns by extracting logic into custom hooks and splitting the UI into focused, presentational components.

*   **Custom Hook (`useUserProfile`):** Encapsulates data fetching, form state, and submission logic.
*   **Container Component (`UserProfile`):** Orchestrates data flow and loading states.
*   **Presentational Components (`ProfileHeader`, `ProfileForm`):** Pure UI components that receive props and handle user interactions.
*   **Shared UI Primitives (`src/components/ui/`):** Reusable design tokens like `Button`, `Input`, and `Avatar`.

**Directory Layout:**
```
src/
├── components/
│   └── ui/                     # Reusable design primitives
│       ├── Button.tsx
│       ├── Input.tsx
│       └── Avatar.tsx
└── features/
    └── profile/                # Feature-based organization
        ├── components/
        │   ├── UserProfile.tsx   # Container
        │   ├── ProfileHeader.tsx # Presentational
        │   └── ProfileForm.tsx   # Presentational
        └── hooks/
            └── useUserProfile.ts # Business logic & state
```

### 3. Example Implementation

```tsx
// src/features/profile/hooks/useUserProfile.ts
import { useState, useEffect } from 'react';
import { getCurrentUserProfile, updateCurrentUserProfile } from '@/server/profileActions';

export function useUserProfile() {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const result = await getCurrentUserProfile();
        if (result.success) setProfile(result.data);
      } catch (err) {
        setError("Falha ao carregar perfil");
      } finally {
        setIsLoading(false);
      }
    }
    fetchProfile();
  }, []);

  const handleUpdate = async (data) => {
    const result = await updateCurrentUserProfile(data);
    if (result.success) setProfile(result.data);
    return result;
  };

  return { profile, isLoading, error, handleUpdate };
}

// src/features/profile/components/UserProfile.tsx
import { useUserProfile } from '../hooks/useUserProfile';
import { ProfileHeader } from './ProfileHeader';
import { ProfileForm } from './ProfileForm';
import { LoadingSpinner } from '@/components/LoadingSpinner';

export default function UserProfile() {
  const { profile, isLoading, error, handleUpdate } = useUserProfile();

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="profile-container max-w-4xl mx-auto space-y-8">
      <ProfileHeader 
        name={profile.name} 
        nickname={profile.nickname} 
        image={profile.image} 
      />
      <ProfileForm 
        initialData={profile} 
        onSubmit={handleUpdate} 
      />
    </div>
  );
}

// src/features/profile/components/ProfileForm.tsx
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function ProfileForm({ initialData, onSubmit }) {
  const { register, handleSubmit, formState: { isSubmitting } } = useForm({
    defaultValues: initialData
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 bg-gray-900 p-6 rounded-lg">
      <div className="space-y-2">
        <label className="text-white text-sm">Nome Completo</label>
        <Input {...register("name")} placeholder="Seu nome" />
      </div>
      
      <div className="space-y-2">
        <label className="text-white text-sm">Nickname</label>
        <Input {...register("nickname")} placeholder="Seu apelido" />
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Salvando..." : "Salvar Alterações"}
      </Button>
    </form>
  );
}
```
