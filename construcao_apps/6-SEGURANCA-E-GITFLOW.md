# 🛡️ Segurança e Fluxo de Trabalho (GitFlow)

Proteção de dados e organização do trabalho são fundamentais para escalar.

## 🔒 Segurança: Os 3 Pilares

### 1. Middleware (A Porta de Entrada)
Todo app deve ter um `middleware.ts` que bloqueia o acesso de usuários não logados às rotas protegidas (`/dashboard`).
```typescript
// Exemplo básico
export default authMiddleware({
  publicRoutes: ["/", "/sign-in", "/sign-up"]
});
```

### 2. Validação de Dados (Zod no Front e no Back)
Nunca confie no que vem do cliente. Use **Zod** para validar inputs.
*   **No Server Action**:
    ```typescript
    const parsed = schema.safeParse(data);
    if (!parsed.success) return { error: "Dados inválidos" };
    ```

### 3. Verificação de Permissão (Role-Based)
Apenas estar logado não basta. Para ações críticas (deletar, promover admin), verifique a *role* do usuário dentro da Server Action.
```typescript
const { userId } = auth();
const user = await db.query.users.findFirst({ where: eq(users.id, userId) });
if (user?.role !== 'admin') throw new Error("Não autorizado");
```

---

## 🌿 GitFlow Simplificado

Para manter o histórico limpo e evitar conflitos.

### Ramificações (Branches)
1.  **`main`**: Código de PRODUÇÃO. Intocável. Só recebe Merge de `develop`.
2.  **`develop`** (ou `staging`): Código de TESTE. Onde juntamos as features.
3.  **`feat/nome-da-funcionalidade`**: Onde você trabalha.
    *   Ex: `feat/login-page`, `fix/botao-voltar`.

### Commits Semânticos
Padronize as mensagens de commit para facilitar a leitura do histórico.
*   `feat`: Nova funcionalidade. (Ex: `feat: adiciona filtro de busca`)
*   `fix`: Correção de bug. (Ex: `fix: corrige erro de login`)
*   `docs`: Mudança na documentação.
*   `style`: Ajustes de formatação (espaços, ponto e vírgula).
*   `refactor`: Refatoração de código sem mudar funcionalidade.

### Fluxo de Trabalho
1.  Crie a branch: `git checkout -b feat/nova-tela`
2.  Trabalhe e commite: `git commit -m "feat: cria estrutura da tela"`
3.  Empurre: `git push origin feat/nova-tela`
4.  Abra um **Pull Request (PR)** para `main` (ou `develop`).
