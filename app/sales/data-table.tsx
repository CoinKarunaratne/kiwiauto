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

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui/table";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Sales } from "./page";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: any;
}

type RootState = {
  businessID: string;
  businessName: string;
};

export function DataTable<TData, TValue>({
  columns,
  data: initialData,
}: DataTableProps<TData, TValue>) {
  const [data, setData] = useState(initialData);
  const [isShowAll, setShowAll] = useState(false);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const businessID = useSelector((state: RootState) => state.businessID);
  const businessName = useSelector((state: RootState) => state.businessName);

  useEffect(() => {
    function fetchData() {
      const salesData = initialData.filter(
        (doc: Sales) => doc?.businessID === businessID
      );
      if (isShowAll) {
        setData(initialData);
      } else {
        setData(salesData);
      }
    }

    fetchData();
  }, [businessID, isShowAll, initialData]);

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
    <div>
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter customers...."
          value={
            (table.getColumn("customer")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("customer")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <Button
          variant="outline"
          className="ml-auto"
          onClick={() => setShowAll((state) => !state)}
        >
          {isShowAll ? `Show ${businessName} customers` : "Show all customers"}
        </Button>
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
    </div>
  );
}