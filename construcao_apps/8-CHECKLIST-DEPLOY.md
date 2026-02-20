# 🚀 Checklist de Deploy (Pre-Flight)

> "Só sobe quem testa."

Antes de fazer o push para a branch `main` ou rodar o deploy na Vercel, siga este checklist obrigatório. Isso evita 99% dos erros de "Build Failed".

## 1. O Código Compila? (Build Local)
O erro mais comum é achar que funciona só porque rodou no `dev`. O build de produção é mais rigoroso.
- [ ] Rode: `npm run build`
- [ ] **Sucesso?** Se aparecer "Compiled successfully", pode seguir.
- [ ] **Erro?** Leia o log. Geralmente é erro de tipagem (TypeScript) ou variável não usada.

## 2. O Linter está Feliz?
A Vercel bloqueia o deploy se houver qualquer aviso de lint não tratado.
- [ ] Rode: `npm run lint`
- [ ] **Avisos de `unused vars`?** Remova a variável ou use `_nome`.
- [ ] **Avisos de `useEffect`?** Verifique se faltou alguma dependência no array `[]`.

## 3. Variáveis de Ambiente (Environment Variables)
Se você adicionou uma nova funcionalidade que usa uma chave secreta...
- [ ] Adicionei a variável no `.env` local?
- [ ] Adicionei a variável no painel da **Vercel** (Settings > Environment Variables)?
- [ ] O nome está **EXATAMENTE** igual? (`TURSO_AUTH_TOKEN` !== `TURSO_TOKEN`)

## 4. Banco de Dados
- [ ] Fiz alterações no `schema.ts`?
- [ ] Se sim, rodei `npx drizzle-kit push` para atualizar o banco real?
- [ ] O banco de produção (Turso) está acessível?

## 5. Dependências
- [ ] Instalei algum pacote novo (`npm install x`)?
- [ ] O `package.json` está comitado? (A Vercel precisa dele para instalar as coisas).
- [ ] **Erro de Versão?** Se usar `shadcn`, verifique se as dependências (`lucide-react`, `date-fns`) estão compatíveis.

## 6. Limpeza
- [ ] Removi `console.log` esquecidos?
- [ ] Removi código comentado morto?

---
**Se tudo estiver marcado:**
```bash
git add .
git commit -m "chore: pre-flight check passed"
git push origin main
```
🚀 **Bom voo!**
