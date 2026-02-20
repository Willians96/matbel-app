# 🏗️ Padrão de Construção de Apps - PMESP

> "Apps cada vez mais rápidos e limpos."

Este diretório documenta os padrões do projeto **Matbel** (Controle de Material Bélico — CPI-7). O objetivo é padronizar o desenvolvimento garantindo qualidade visual (UI Premium), performance e segurança desde o primeiro dia.

## 🎯 Filosofia
1.  **Visual Premium**: Interfaces modernas, responsivas (Mobile-First), PM-blue como cor de destaque.
2.  **Robustez**: Tipagem forte (TypeScript), validação (Zod), Server Actions.
3.  **Velocidade**: Deploy contínuo (Vercel) + Banco de Dados na borda (Turso/LibSQL).
4.  **Segurança**: Autenticação robusta (Clerk) e proteção de rotas via Middleware.

## 📚 Índice da Documentação

### [1. Stack Tecnológica](./2-STACK-TECNOLOGICA.md)
Next.js 16, Tailwind v4, Drizzle ORM, Clerk, Turso/LibSQL — a "Golden Stack".

### [2. Guia Passo a Passo](./3-GUIA-PASSO-A-PASSO.md)
Tutorial completo do zero ao deploy: GitHub, Vercel, Env Vars, Banco de Dados.

### [3. Base do Dashboard (Boilerplate)](./4-BASE-DASHBOARD.md)
Código padrão para Menu Lateral, Header e Layout responsivo. Copie e adapte.

### [4. Padrões de UI/UX](./5-BOAS-PRATICAS-E-ERROS.md)
Cores (Azul PM), Tipografia, Componentes Shadcn/UI, Toasts, animações.

### [5. Segurança e GitFlow](./6-SEGURANCA-E-GITFLOW.md)
Middleware, Zod validation, role checks, branching strategy, semantic commits.

### [6. Design System Premium](./7-DESIGN-SYSTEM-PREMIUM.md)
Paleta de cores, tipografia, sombras, Cards, Tables, Filtros e micro-animações.

### [7. Deploy Checklist](./8-CHECKLIST-DEPLOY.md)
Pré-voo antes de qualquer push para produção.

### [8. Geração de PDF](./9-GERACAO-PDF.md)
Como gerar Termos de Carga/Devolução via jsPDF (client-side, sem dependências de servidor).

## 🗓️ Histórico de Features Implementadas

| Versão | Feature |
|--------|---------|
| v1.0 | Dashboard base + Sidebar + Mobile Nav |
| v1.1 | CRUD de Equipamentos + QR/Serial |
| v1.2 | Sistema de Transferências (Carga/Devolução) |
| v1.3 | Declaração de Material Permanente Admin |
| v1.4 | Histórico de Transferências + Filtros avançados |
| v1.5 | Edição de dados de usuário pelo Admin |
| v1.6 | Responsividade Mobile em todas as páginas |
| v1.7 | Geração de PDF — Termos de Carga/Devolução |

---

**Autor:** Equipe de Desenvolvimento Ágil — CPI-7
**Versão:** 1.7.0 — Fev/2026
