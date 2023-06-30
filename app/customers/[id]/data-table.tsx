"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { CheckCircle2, Circle } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui/table";
import { useEffect, useState } from "react";
import { DateRange } from "react-day-picker";
import { DataTableFacetedFilter } from "./facet-filter";
import { ModifiedSales } from "@/app/sales/page";
import { DataTablePagination } from "./table-pagination";
import { CustomerDateRangePicker } from "./date-range-picker";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: any;
}

export function DataTable<TData, TValue>({
  columns,
  data: initialData,
}: DataTableProps<TData, TValue>) {
  const [data, setData] = useState(initialData);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [date, setDate] = useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  });

  const statuses = [
    {
      value: "pending",
      label: "Pending",
      icon: Circle,
    },

    {
      value: "paid",
      label: "Paid",
      icon: CheckCircle2,
    },
  ];

  useEffect(() => {
    const options: Intl.DateTimeFormatOptions = {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    };
    function fetchData() {
      if (date?.to === undefined && date?.from != undefined) {
        const startDate = date?.from?.toLocaleDateString("en-GB", options);

        const rangeData = initialData.filter(
          (doc: ModifiedSales) => doc.createdAt === startDate
        );
        setData(rangeData);
      } else {
        if (date?.to != undefined && date?.from != undefined) {
          const startDate =
            date?.from?.toLocaleDateString("en-GB", options) ?? "";
          const endDate = date?.to?.toLocaleDateString("en-GB", options) ?? "";

          const rangeData = initialData.filter((doc: ModifiedSales) => {
            const { createdAt } = doc;
            if (createdAt) {
              return createdAt >= startDate && createdAt <= endDate;
            }
          });
          setData(rangeData);
        } else {
          setData(initialData);
        }
      }
    }

    fetchData();
  }, [initialData, date]);

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-end sm:flex-row sm:items-center py-4 gap-4">
        <div className="sm:ml-auto flex flex-col md:flex-row gap-2">
          <DataTableFacetedFilter
            column={table.getColumn("status")}
            title="Status"
            options={statuses}
          />
          <CustomerDateRangePicker date={date} setDate={setDate} />
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  );
}
