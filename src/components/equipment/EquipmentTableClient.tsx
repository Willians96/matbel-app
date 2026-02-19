'use client';

import React, { useState, useEffect } from \"react\";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from \"@/components/ui/table\";
import ActionMenu from \"@/components/ui/action-menu\";

export default function EquipmentTableClient({ items = [], initialPage = 1, pageSize = 10 }: {
  items?: any[];
  initialPage?: number;
  pageSize?: number;
}) {
  const [page, setPage] = useState(initialPage);
  const [data, setData] = useState(items || []);
  const [total, setTotal] = useState<number>(items ? items.length : 0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function fetchPage() {
      setLoading(true);
      try {
        const res = await fetch(`/api/equipment?page=${page}&pageSize=${pageSize}`);
        const json = await res.json();
        if (!mounted) return;
        if (json.success) {
          setData(json.data || []);
          setTotal(json.total || 0);
        } else {
          setData([]);
          setTotal(0);
        }
      } catch {
        setData([]);
        setTotal(0);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    fetchPage();
    return () => {
      mounted = false;
    };
  }, [page, pageSize]);

  const pageItems = data;

  return (
    <>
      <div className=\"animate-fade-in\">
      <Table>
        <TableHeader className=\"bg-slate-50\">
          <TableRow>
            <TableHead>Serial</TableHead>
            <TableHead>Patrimônio</TableHead>
            <TableHead>Nome</TableHead>
            <TableHead>Categoria</TableHead>
            <TableHead>Unidade</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className=\"w-[80px] text-right\">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading
            ? Array.from({ length: pageSize }).map((_, idx) => (
                <TableRow key={`skeleton-${idx}`}>
                  <TableCell><div className=\"h-4 bg-slate-200 rounded w-24 animate-pulse\" /></TableCell>
                  <TableCell><div className=\"h-4 bg-slate-200 rounded w-16 animate-pulse\" /></TableCell>
                  <TableCell><div className=\"h-4 bg-slate-200 rounded w-32 animate-pulse\" /></TableCell>
                  <TableCell><div className=\"h-4 bg-slate-200 rounded w-20 animate-pulse\" /></TableCell>
                  <TableCell><div className=\"h-4 bg-slate-200 rounded w-20 animate-pulse\" /></TableCell>
                  <TableCell><div className=\"h-4 bg-slate-200 rounded w-16 animate-pulse\" /></TableCell>
                  <TableCell><div className=\"h-4 bg-slate-200 rounded w-8 animate-pulse ml-auto\" /></TableCell>
                </TableRow>
              ))
            : pageItems.map((item) => (
                <TableRow key={item.id} className=\"hover:bg-slate-50/50\">
                  <TableCell className=\"font-mono font-medium text-slate-700\">{item.serialNumber}</TableCell>
                  <TableCell className=\"text-slate-600\">{item.patrimony || \"-\"}</TableCell>
                  <TableCell className=\"font-medium text-slate-900\">{item.name}</TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell>{item.unit}</TableCell>
                  <TableCell>
                    <span
                      title={item.status}
                      className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                        item.status === \"disponivel\"
                          ? \"bg-green-50 text-green-700 border-green-200\"
                          : item.status === \"em_uso\"
                          ? \"bg-yellow-50 text-yellow-700 border-yellow-200\"
                          : item.status === \"manutencao\"
                          ? \"bg-red-50 text-red-700 border-red-200\"
                          : \"bg-gray-100 text-gray-700 border-gray-200\"
                      }`}
                    >
                      {item.status === \"disponivel\"
                        ? \"Disponível\"
                        : item.status === \"em_uso\"
                        ? \"Em Uso\"
                        : item.status === \"manutencao\"
                        ? \"Manutenção\"
                        : \"Baixado\"}
                    </span>
                  </TableCell>
                  <TableCell className=\"text-right\">
                    <ActionMenu
                      onView={() => (window.location.href = `/dashboard/equipment/${item.id}`)}
                      onEdit={() => (window.location.href = `/dashboard/equipment/${item.id}/edit`)}
                      onDelete={async () => {
                        try {
                          const res = await fetch(`/api/equipment/${item.id}`, { method: \"DELETE\" });
                          if (!res.ok) throw new Error(\"delete failed\");
                          window.location.reload();
                        } catch (e) {
                          alert(\"Falha ao excluir o equipamento.\");
                        }
                      }}
                    />
                  </TableCell>
                </TableRow>
              ))}
        </TableBody>
      </Table>
      </div>
      <div className=\"mt-4 flex items-center justify-end gap-3\">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          className=\"px-3 py-1 rounded-md border bg-white disabled:opacity-50\"
        >
          Anterior
        </button>
        <div className=\"text-sm text-muted-foreground\">
          Página {page} de {Math.max(1, Math.ceil(total / pageSize))}
        </div>
        <button
          onClick={() => setPage((p) => Math.min(Math.ceil(total / pageSize), p + 1))}
          disabled={page >= Math.ceil(total / pageSize)}
          className=\"px-3 py-1 rounded-md border bg-white disabled:opacity-50\"
        >
          Próxima
        </button>
      </div>
    </>
  );
}

