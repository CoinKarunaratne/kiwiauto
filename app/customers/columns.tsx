"use client";

import { ColumnDef } from "@tanstack/react-table";

export type Customer = {
  name: string | undefined;
  contact: string | undefined;
  sales: number | undefined;
};

export const columns: ColumnDef<Customer>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "contact",
    header: "Contact",
  },
  {
    accessorKey: "sales",
    header: "No. of sales",
  },
];
