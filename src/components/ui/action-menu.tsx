"use client";

import React, { useState, useRef, useEffect } from "react";
import { MoreVertical, Trash2, Edit2, Eye } from "lucide-react";

export default function ActionMenu({
  onEdit,
  onDelete,
  onView,
}: {
  onEdit?: () => void;
  onDelete?: () => void;
  onView?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("click", onDoc);
    return () => document.removeEventListener("click", onDoc);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={ref}>
      <button
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="p-1 rounded-md hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--focus-ring)/0.35)]"
        title="Ações"
      >
        <MoreVertical className="w-4 h-4" />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-40 bg-white border rounded-md shadow-md z-40 py-1"
        >
          <button
            role="menuitem"
            className="w-full text-left px-3 py-2 text-sm hover:bg-slate-50 flex items-center gap-2"
            onClick={() => {
              setOpen(false);
              onView && onView();
            }}
          >
            <Eye className="w-4 h-4 text-slate-600" /> Ver
          </button>
          <button
            role="menuitem"
            className="w-full text-left px-3 py-2 text-sm hover:bg-slate-50 flex items-center gap-2"
            onClick={() => {
              setOpen(false);
              onEdit && onEdit();
            }}
          >
            <Edit2 className="w-4 h-4 text-slate-600" /> Editar
          </button>
          <button
            role="menuitem"
            className="w-full text-left px-3 py-2 text-sm hover:bg-red-50 flex items-center gap-2 text-red-600"
            onClick={() => {
              setOpen(false);
              if (confirm("Confirma exclusão deste item?")) {
                onDelete && onDelete();
              }
            }}
          >
            <Trash2 className="w-4 h-4" /> Excluir
          </button>
        </div>
      )}
    </div>
  );
}

