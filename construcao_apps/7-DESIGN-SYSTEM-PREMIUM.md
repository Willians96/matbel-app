# 🎨 Design System Premium (Padrão PMESP)

> "A primeira impressão é a que fica."

Este guia define os padrões visuais que garantem que todos os aplicativos da suíte tenham a mesma aparência profissional, moderna e institucional.

## 1. Cores Institucionais
A paleta baseia-se na sobriedade e confiança da Polícia Militar, com toques modernos.

| Nome | Hex | Tailwind Class | Uso |
| :--- | :--- | :--- | :--- |
| **PM Blue** | `#002147` | `bg-pm-blue` / `text-pm-blue` | Header, Sidebar, Botões Primários, Títulos. |
| **Slate 50** | `#F8FAFC` | `bg-slate-50` | Fundo das páginas (Background). |
| **Slate 200** | `#E2E8F0` | `border-slate-200` | Bordas sutis de Cards e Tabelas. |
| **White** | `#FFFFFF` | `bg-white` | Fundo de Cards e Inputs. |
| **Red 600** | `#DC2626` | `bg-red-600` | Ações destrutivas, Botão "Limpar", Erros. |
| **Emerald 600** | `#059669` | `text-emerald-600` | Sucesso, Status "Disponível". |

## 2. Tipografia
Usamos a fonte padrão do sistema (San Francisco/Inter) mas com pesos específicos para hierarquia.
*   **H1 (Títulos de Página)**: `text-3xl font-bold tracking-tight text-pm-blue`.
*   **H2 (Subtítulos)**: `text-xl font-semibold text-slate-800`.
*   **Corpo**: `text-sm text-slate-600`.
*   **Labels**: `text-xs font-medium text-muted-foreground uppercase tracking-wider`.

## 3. Sombras e Profundidade (Glassmorphism Sutil)
Não usamos sombras pesadas. Preferimos bordas finas e sombras difusas.
*   **Cards**: `shadow-sm border border-slate-200`.
*   **Destaques (Botões/Ícones)**: `shadow-lg shadow-blue-900/20` (Sombra colorida suave).
*   **Modais/Didalogs**: `shadow-xl`.

## 4. Componentes Chave

### Cards de Estatísticas
```tsx
<Card className="border-l-4 border-l-pm-blue shadow-sm">
  {/* Conteúdo */}
</Card>
```

### Tabelas Premium
*   **Header**: `bg-slate-50` com textos `font-semibold text-slate-700`.
*   **Linhas**: `hover:bg-slate-50/50 transition-colors`.
*   **Badges**: Use cores suaves (`bg-blue-100 text-blue-700`) em vez de cores sólidas fortes.

### Filtros (Padrão URL)
*   Sempre sincronize os filtros com a URL (`useSearchParams`).
*   O botão "Limpar" deve ser sempre vermelho sólido (`bg-red-600`) para fácil identificação.
*   O botão "Pesquisar" deve ser Azul PM (`bg-pm-blue`).

## 5. Animações (Micro-interações)
Interfaces estáticas parecem velhas. Use animações sutis de entrada.
*   **Ao carregar página**: `animate-in fade-in slide-in-from-bottom-4 duration-500`.
*   **Hover**: `transition-all active:scale-95` em botões interativos.

---
**Nota**: Ao criar um novo app, copie o `globals.css` deste projeto para garantir que as variáveis CSS (`--radius`, `--color-pm-blue`) estejam presentes.
