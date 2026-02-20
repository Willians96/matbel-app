# 🧩 Base do Dashboard (Boilerplate)

Para ter o "esqueleto" da aplicação pronto, você precisará de 3 componentes principais e 1 layout.

## 1. Estrutura de Arquivos Recomendada
```
src/
├── app/
│   ├── dashboard/
│   │   ├── layout.tsx      <-- Onde a mágica acontece
│   │   ├── page.tsx        <-- Home do Dashboard
│   │   └── ... (outras rotas)
│   └── layout.tsx          <-- Root Layout (ClerkProvider aqui)
└── components/
    └── dashboard/
        ├── header.tsx
        ├── sidebar.tsx
        └── mobile-nav.tsx
```

## 2. O Layout do Dashboard (`src/app/dashboard/layout.tsx`)
Este arquivo garante que o menu lateral e o conteúdo se comportem corretamente em Desktop e Mobile.

```tsx
import { Sidebar } from "@/components/dashboard/sidebar";
import { Header } from "@/components/dashboard/header";
import { MobileNav } from "@/components/dashboard/mobile-nav";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-slate-50">
            {/* Sidebar Desktop */}
            <aside className="hidden md:flex w-64 flex-col fixed inset-y-0 z-50">
                <Sidebar />
            </aside>

            {/* Mobile Nav */}
            <div className="md:hidden sticky top-0 z-50">
                 <MobileNav /> {/* Precisa passar userRole se tiver controle de acesso */}
            </div>

            {/* Conteúdo Principal */}
            <main className="md:pl-64 flex flex-col min-h-screen transition-all duration-300">
                <Header />
                <div className="flex-1 p-6 md:p-8 pt-6 max-w-7xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {children}
                </div>
            </main>
        </div>
    );
}
```

## 3. Configuração do Menu (`src/components/dashboard/sidebar.tsx`)
Centralize a configuração dos links aqui para fácil manutenção.

```tsx
import { LayoutDashboard, Users, Settings, LogOut } from "lucide-react";

export const sidebarItems = [
    { title: "Painel Geral", href: "/dashboard", icon: LayoutDashboard },
    { title: "Usuários", href: "/dashboard/users", icon: Users, role: "admin" }, // Exemplo com role
    { title: "Configurações", href: "/dashboard/settings", icon: Settings },
];

export function Sidebar() {
    // Implementação do visual da Sidebar (bg-pm-blue)
    // Use o componente Link do next/link
    // Mapeie sidebarItems
}
```

## 4. Dicas de Ouro
1.  **Animações**: Use `animate-in fade-in` nas páginas para dar sensação de fluidez.
2.  **Loading**: Crie sempre um `loading.tsx` na pasta `dashboard` com Skeletons para carregamento instantâneo da UI.
3.  **Ícones**: Use sempre ícones da `lucide-react` para manter a consistência visual.
