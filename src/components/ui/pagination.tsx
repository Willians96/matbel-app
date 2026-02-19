"use client";

import React from "react";

export default function Pagination({
  total,
  page,
  pageSize,
  onPage,
}: {
  total: number;
  page: number;
  pageSize: number;
  onPage: (p: number) => void;
}) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  return (
    <div className="flex items-center justify-between px-2 py-3">
      <div className="text-sm text-muted-foreground">
        Página {page} de {totalPages}
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPage(Math.max(1, page - 1))}
          disabled={page <= 1}
          className="px-3 py-1 rounded-md bg-white border hover:bg-slate-50 disabled:opacity-50"
        >
          Anterior
        </button>
        <button
          onClick={() => onPage(Math.min(totalPages, page + 1))}
          disabled={page >= totalPages}
          className="px-3 py-1 rounded-md bg-white border hover:bg-slate-50 disabled:opacity-50"
        >
          Próxima
        </button>
      </div>
    </div>
  );
}

