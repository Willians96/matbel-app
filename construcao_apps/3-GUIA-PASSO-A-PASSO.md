# 🚀 Guia Passo a Passo: Do Zero ao Deploy

Siga este roteiro para iniciar um novo projeto padronizado em menos de 15 minutos.

## Fase 1: Inicialização Local
1.  **Criar o Projeto**:
    ```bash
    npx create-next-app@latest nome-do-app --typescript --tailwind --eslint
    # Opções: Yes para tudo (App Router, src dir, import alias @)
    ```
2.  **Limpar o Boilerplate**:
    *   Delete o conteúdo de `src/app/page.tsx`.
    *   Delete o CSS padrão de `src/app/globals.css` (mantenha apenas as diretivas do Tailwind).
3.  **Instalar Shadcn/UI**:
    ```bash
    npx shadcn-ui@latest init
    # Style: New York, Base Color: Slate, CSS Variables: Yes
    ```

## Fase 2: Configuração do Banco (Turso & Drizzle)
1.  **Instalar Dependências**:
    ```bash
    npm install drizzle-orm @libsql/client dotenv
    npm install -D drizzle-kit
    ```
2.  **Criar Banco no Turso**:
    *   Crie uma conta e um banco em [turso.tech](https://turso.tech).
    *   Gere o `TURSO_CONNECTION_URL` e `TURSO_AUTH_TOKEN`.
3.  **Configurar `.env`**:
    ```env
    TURSO_CONNECTION_URL="libsql://seu-banco.turso.io"
    TURSO_AUTH_TOKEN="seu-token"
    ```
4.  **Configurar Drizzle**:
    *   Crie `drizzle.config.ts` e `src/db/index.ts` (Copie do projeto Matbel).

## Fase 3: Autenticação (Clerk)
1.  **Criar App no Clerk**:
    *   Acesse [dashboard.clerk.com](https://dashboard.clerk.com) e crie um app.
    *   Ative Email/Password ou Social Login.
2.  **Instalar e Configurar**:
    ```bash
    npm install @clerk/nextjs
    ```
3.  **Middleware**:
    *   Crie `src/middleware.ts` para proteger rotas.

## Fase 4: Padrão Visual (UI Premium)
1.  **Variáveis CSS (`globals.css`)**:
    *   Adicione a cor institucional: `--color-pm-blue: #002147;`.
2.  **Instalar Componentes Base**:
    ```bash
    npx shadcn-ui@latest add button card input table dialog sheet dropdown-menu avatar badge
    npm install lucide-react sonner
    ```
3.  **Copiar Estrutura de Menu**:
    *   Copie a pasta `src/components/dashboard` (Sidebar, Header, MobileNav) do projeto Matbel.
    *   Ajuste apenas os itens do menu em `sidebar.tsx`.

## Fase 5: Deploy (Vercel)
1.  Suba o código para o **GitHub**.
2.  Importe o projeto na **Vercel**.
3.  Adicione as Variáveis de Ambiente (`TURSO_...`, `CLERK_...`) nas configurações do projeto na Vercel.
4.  Clique em **Deploy**. 🚀

---
**Próximo Passo**: Defina o modelo de dados em `schema.ts` e comece a criar as páginas das funcionalidades.
