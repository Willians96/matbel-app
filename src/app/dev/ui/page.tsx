 'use client';

import React from "react";
import { Button, Input } from "@/components/ui";

export default function UIPlayground() {
  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow p-6 sm:p-8">
        <header className="mb-6">
          <h1 className="text-3xl sm:text-4xl font-bold mb-1">UI Preview — Component Playground</h1>
          <p className="text-sm text-muted-foreground">
            Biblioteca de componentes e tokens — use esta página para validar visualmente
            variações, estados e responsividade.
          </p>
        </header>

        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-3">Buttons</h2>
          <div className="flex flex-wrap gap-3 items-center">
            <Button variant="default">Default</Button>
            <Button variant="primary">Primary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="primary" className="px-6 py-3 text-base">Primary Large</Button>
            <Button disabled>Disabled</Button>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-3">Form Elements</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Text input</label>
              <Input placeholder="Type here..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Search</label>
              <Input placeholder="Search..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Responsive input</label>
              <Input placeholder="Resize the window to test" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Disabled</label>
              <Input placeholder="Disabled input" disabled />
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-3">Spacing & Layout</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <BoxDemo size="sm" />
            <BoxDemo size="md" />
            <BoxDemo size="lg" />
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            Observe como os componentes se reorganizam em telas menores.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-3">Colors & Tokens</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <TokenSwatch name="pm-blue" className="bg-[#002147]" />
            <TokenSwatch name="pm-yellow" className="bg-[#f1c40f]" />
            <TokenSwatch name="primary" className="bg-[hsl(var(--primary))]" />
            <TokenSwatch name="background" className="bg-[hsl(var(--background))]" />
            <TokenSwatch name="foreground" className="bg-[hsl(var(--foreground))]" />
            <TokenSwatch name="card" className="bg-[hsl(var(--card))]" />
            <TokenSwatch name="accent" className="bg-[hsl(var(--accent))]" />
            <TokenSwatch name="muted" className="bg-[hsl(var(--muted))]" />
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-3">Typography</h2>
          <div className="space-y-3">
            <h1 className="text-3xl font-bold">H1 — Heading</h1>
            <h2 className="text-2xl font-semibold">H2 — Subheading</h2>
            <p className="text-base">
              Parágrafo de exemplo — The quick brown fox jumps over the lazy dog. Use esta área para validar
              legibilidade em diferentes tamanhos de tela.
            </p>
            <pre className="p-3 bg-slate-50 rounded text-sm font-mono">.text-base .prose .lead</pre>
          </div>
        </section>
      </div>
    </div>
  );
}

function TokenSwatch({ name, className }: { name: string; className?: string }) {
  return (
    <div className="flex items-center gap-3 p-3 border rounded">
      <div className={`w-12 h-12 rounded ${className ?? "bg-slate-200"}`} />
      <div>
        <div className="font-mono text-sm">{name}</div>
      </div>
    </div>
  );
}

function BoxDemo({ size }: { size: 'sm' | 'md' | 'lg' }) {
  const map = {
    sm: 'p-3',
    md: 'p-6',
    lg: 'p-10',
  } as const;
  return (
    <div className="border rounded">
      <div className={`bg-[hsl(var(--card))] text-[hsl(var(--card-foreground))] ${map[size]} min-h-[80px]`}>
        <div className="font-semibold">Box {size.toUpperCase()}</div>
        <div className="text-sm text-muted-foreground">Padding: {size}</div>
      </div>
    </div>
  );
}

