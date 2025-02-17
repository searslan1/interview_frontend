"use client"

import { useState } from "react"
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  type SortingState,
  getSortedRowModel,
} from "@tanstack/react-table"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import type { Question } from "@/app/questions/page"

interface QuestionTableProps {
  questions: Question[]
  onEdit: (question: Question) => void
  onDelete: (id: string) => void
}

export function QuestionTable({ questions, onEdit, onDelete }: QuestionTableProps) {
  const [sorting, setSorting] = useState<SortingState>([])

  const columns: ColumnDef<Question>[] = [
    {
      accessorKey: "text",
      header: "Soru",
    },
    {
      accessorKey: "duration",
      header: "Süre (sn)",
    },
    {
      accessorKey: "tags",
      header: "Etiketler",
      cell: ({ row }) => row.original.tags.join(", "),
    },
    {
      accessorKey: "answerType",
      header: "Cevap Tipi",
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => onEdit(row.original)}>
            Düzenle
          </Button>
          <Button variant="destructive" size="sm" onClick={() => onDelete(row.original.id)}>
            Sil
          </Button>
        </div>
      ),
    },
  ]

  const table = useReactTable({
    data: questions,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  })

  return (
    <div>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                Soru bulunamadı.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
          Önceki
        </Button>
        <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
          Sonraki
        </Button>
      </div>
    </div>
  )
}

