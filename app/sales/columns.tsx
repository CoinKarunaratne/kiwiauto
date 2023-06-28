"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Timestamp } from "firebase/firestore";

export type Sale = {
  status: "paid" | "pending" | undefined;
  createdAt: Timestamp | undefined;
  customer: string | undefined;
  service: string | undefined;
  price: string | undefined;
};

export const columns: ColumnDef<Sale>[] = [
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "createdAt",
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
    accessorKey: "price",
    header: "Amount",
  },
];
