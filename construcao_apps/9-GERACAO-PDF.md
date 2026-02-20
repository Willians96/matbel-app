# 📄 Geração de PDF — Termos de Carga e Devolução

## Visão Geral

O sistema gera automaticamente um **Termo de Carga** ou **Termo de Devolução** em PDF para cada transferência registrada. O PDF é gerado 100% no client-side usando `jsPDF`, sem dependências de servidor.

## Tecnologia

- **Biblioteca**: [`jspdf`](https://github.com/parallax/jsPDF) v2.x
- **Import**: Dinâmico (`await import("jspdf")`) para evitar erros no SSR do Next.js
- **Trigger**: Botão na coluna "Ações" da tabela de Histórico

## Arquitetura

```
src/
├── lib/
│   └── pdf/
│       └── termo-carga.ts         ← Gerador principal (jsPDF)
└── components/
    └── dashboard/
        └── history/
            └── download-termo-button.tsx  ← Botão com lazy-load
```

## Como Funciona

1. Admin clica em **"Termo"** na linha do histórico
2. `DownloadTermoButton` chama `gerarTermoCarga(item)` via import dinâmico
3. jsPDF monta o documento A4 com:
   - Header PM-blue com nome da unidade
   - Dados do policial (posto, nome, RE, unidade)
   - Dados do equipamento (nome, serial, patrimônio, status)
   - Texto de declaração formal gerado automaticamente
   - Linhas de assinatura
   - Hash digital (ID + timestamp ISO)
4. O arquivo é salvo automaticamente:
   - `termo-carga-{RE}-{ID6}.pdf` para alocações
   - `termo-devolucao-{RE}-{ID6}.pdf` para devoluções

## Como Adicionar Campos ao PDF

Edite `src/lib/pdf/termo-carga.ts`. Para adicionar um campo:

```ts
// Após sectionTitle("Dados do Policial")
row("Novo Campo:", item.user.novoCampo ?? "—");
curY += 6;
```

## Extensões Futuras

- [ ] Adicionar logo PMESP (base64 PNG)
- [ ] QR Code com link de verificação
- [ ] Geração em lote (múltiplos termos)
- [ ] Assinatura digital com hash SHA-256
