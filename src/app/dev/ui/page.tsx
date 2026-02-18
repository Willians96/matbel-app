 'use client';

import React from "react";
import { Button, Input } from "@/components/ui";

export default function UIPlayground() {
  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-8">
        <h1 className="text-2xl font-bold mb-4">UI Preview — Component Playground</h1>

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
          <div className="grid gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Text input</label>
              <Input placeholder="Type here..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Search</label>
              <Input placeholder="Search..." />
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-3">Colors & Tokens</h2>
          <div className="grid grid-cols-3 gap-3">
            <TokenSwatch name="pm-blue" className="bg-[#002147]" />
            <TokenSwatch name="pm-yellow" className="bg-[#f1c40f]" />
            <TokenSwatch name="primary" className="bg-[color:var(--color-primary)]" />
            <TokenSwatch name="background" className="bg-[hsl(var(--background))]" />
            <TokenSwatch name="foreground" className="bg-[hsl(var(--foreground))]" />
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-3">Typography</h2>
          <div className="prose">
            <h3>Heading H3</h3>
            <p>Paragraph sample — The quick brown fox jumps over the lazy dog.</p>
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

