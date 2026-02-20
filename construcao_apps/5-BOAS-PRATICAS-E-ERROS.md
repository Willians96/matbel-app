# 🧠 Boas Práticas e Memória de Erros

> "Aprender com os erros dos outros é sabedoria."

Este documento reúne os padrões de código que garantem a qualidade e lista os erros mais comuns enfrentados durante o desenvolvimento do projeto Matbel, para que não se repitam.

## ✅ Boas Práticas (Do's)

### 1. Estrutura de Pastas e Arquivos
*   **Kebab-case**: Use sempre `nome-do-arquivo.tsx` (letras minúsculas e hífens). Nunca `NomeDoArquivo.tsx`.
*   **Colocação**:
    *   Páginas e Rotas -> `src/app`
    *   Componentes Reutilizáveis -> `src/components/ui`
    *   Componentes de Negócio -> `src/components/dashboard`
    *   Lógica de Banco/Servidor -> `src/server/actions` ou `queries`

### 2. Server Actions vs API Routes
*   **Prefira Server Actions**: Para mutações (Create, Update, Delete) e buscas simples. É mais type-safe e fácil de usar.
*   **Use `use server`**: Sempre coloque `"use server"` no topo dos arquivos em `src/server`.

### 3. Tratamento de Erros
*   **Try/Catch**: Sempre envolva chamadas de banco em blocos `try/catch`.
*   **Retorno Padrão**: Server Actions devem retornar um objeto padrão:
    ```typescript
    return { success: boolean, message?: string, data?: any }
    ```
*   **Toast**: Use `sonner` no frontend para feedback visual (Sucesso/Erro).

### 4. Performance
*   **`revalidatePath`**: Lembre-se de invalidar o cache após uma mutação para atualizar a UI.
*   **Imagens**: Use o componente `<Image />` do Next.js, não `<img>`.
*   **Dependências**: Evite bibliotecas pesadas se uma função simples resolver (ex: lodash).

---

## 🚫 Memória de Erros (Don'ts)

### 1. Erros de Build (Deployment)
*   **Linter Rigoroso**: O Vercel **NÃO** faz deploy se houver *qualquer* erro de Lint ou TypeScript.
    *   *Erro Comum*: Variáveis não utilizadas (`unused vars`).
    *   *Solução*: Remova a variável ou prefixe com `_` (ex: `_error`).
*   **Hooks Condicionais**: Nunca use Hooks (`useEffect`, `useState`) dentro de condicionais (`if`) ou loops. Erro fatal no React.
*   **UseEffect Aninhado**: Nunca coloque um `useEffect` dentro de outro `useEffect`. Isso quebra a aplicação.

### 2. Erros de Banco de Dados (Drizzle/Turso)
*   **Relações**: Ao adicionar uma nova tabela, lembre-se de exportá-la em `src/db/schema.ts` e rodar `npx drizzle-kit push`.
*   **Conexão**: Se o banco falhar, verifique se `TURSO_CONNECTION_URL` começa com `libsql://`.

### 3. Erros de UI/UX
*   **Responsividade**: Sempre teste em tamanho mobile. O menu lateral deve virar um "Drawer" ou "Menu Hambúrguer".
*   **Feedback**: Nunca deixe o usuário clicar num botão sem mostrar um estado de "Carregando..." (`disabled={loading}`).

### 4. Erros de Typescript
*   **`any`**: Evite usar `any`. Defina interfaces para suas props e dados do banco.
*   **Imports**: Evite importações circulares.
