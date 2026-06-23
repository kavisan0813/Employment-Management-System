import React from "react";
import { MoreHorizontal } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/admin/components/ui/table";

interface DataTableProps {
  columns: string[];
  rows: React.ReactNode[][];
  onRowAction?: (rowIndex: number) => void;
  emptyMessage?: string;
}

export function DataTable({
  columns,
  rows,
  onRowAction,
  emptyMessage = "No records found."
}: DataTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-border/40 bg-card shadow-sm dark:bg-card/30 dark:backdrop-blur-md">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50 hover:bg-muted/50">
            {columns.map((col) => (
              <TableHead
                key={col}
                className="h-auto px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground"
              >
                {col}
              </TableHead>
            ))}
            {onRowAction && <TableHead className="w-10" />}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={columns.length + (onRowAction ? 1 : 0)}
                className="px-4 py-10 text-center text-[13px] text-muted-foreground"
              >
                {emptyMessage}
              </TableCell>
            </TableRow>
          ) : (
            rows.map((row, ri) => (
              <TableRow key={ri} className="group hover:bg-muted/30 transition-colors">
                {row.map((cell, ci) => (
                  <TableCell key={ci} className="px-4 py-3 text-[13px] text-foreground align-middle">
                    {cell}
                  </TableCell>
                ))}
                {onRowAction && (
                  <TableCell className="px-2 py-3 text-center align-middle">
                    <button
                      onClick={() => onRowAction(ri)}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                      aria-label="Row actions"
                    >
                      <MoreHorizontal size={14} />
                    </button>
                  </TableCell>
                )}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
