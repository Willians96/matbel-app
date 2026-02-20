# 🛠️ Stack Tecnológica (Golden Stack)

Esta é a combinação de tecnologias padronizada para os novos aplicativos. Ela oferece o melhor equilíbrio entre produtividade, performance e custo-benefício.

## 1. Core & Framework
*   **Next.js 14+ (App Router)**: O framework React mais moderno. Permite renderização no servidor (SSR/RSC) para máxima velocidade e SEO.
*   **TypeScript**: Segurança de tipos. Evita 90% dos bugs comuns de JavaScript em tempo de desenvolvimento.

## 2. Estilização & UI
*   **Tailwind CSS**: Estilização utilitária rápida e consistente.
*   **Shadcn/UI**: Biblioteca de componentes reutilizáveis (Botões, Cards, Dialogs) baseada em Radix UI. Acessível e bonita por padrão.
*   **Lucide React**: Ícones vetoriais leves e modernos.
*   **Sonner**: Notificações (Toasts) elegantes.

## 3. Banco de Dados & ORM
*   **Turso (LibSQL)**: Banco de dados SQLite distribuído na borda (Edge). Extremamente rápido e barato para escalar.
*   **Drizzle ORM**: A melhor ferramenta para interagir com o banco. O código TypeScript vira SQL automaticamente com segurança de tipos.

## 4. Autenticação & Segurança
*   **Clerk Auth**: Gerenciamento completo de usuários (Login, Cadastro 2FA, Gestão de Sessão). Remove a complexidade de manter senhas no próprio banco.

## 5. Infraestrutura & Deploy
*   **Vercel**: Hospedagem otimizada para Next.js. Deploy automático a cada git push.
*   **GitHub**: Controle de versão e CI/CD.

## 📦 Dependências Essenciais (`package.json`)
```json
{
  "dependencies": {
    "next": "latest",
    "react": "latest",
    "react-dom": "latest",
    "drizzle-orm": "^0.30.0",
    "@libsql/client": "^0.6.0",
    "@clerk/nextjs": "latest",
    "lucide-react": "latest",
    "clsx": "latest",
    "tailwind-merge": "latest",
    "sonner": "latest"
  },
  "devDependencies": {
    "drizzle-kit": "latest",
    "typescript": "latest",
    "tailwindcss": "latest"
  }
}
```
