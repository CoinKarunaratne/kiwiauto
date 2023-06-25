"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Timestamp } from "firebase/firestore";

export type Sale = {
  status: "paid" | "pending" | undefined;
  date: Timestamp | undefined;
  customer: string | undefined;
  service: string | undefined;
  amount: string | undefined;
};

export const columns: ColumnDef<Sale>[] = [
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "date",
    header: "Date",
  },
  {
    accessorKey: "customer",
    header: "Customer",
  },
  {
    accessorKey: "service",
    header: "Service",
  },
  {
    accessorKey: "amount",
    header: "Amount",
  },
];
