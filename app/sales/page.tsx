"use client";

import { DataTable } from "./data-table";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "@/config/firebase";
import { Separator } from "../components/ui/separator";
import { Timestamp } from "firebase/firestore";
import { ColumnDef } from "@tanstack/react-table";
import { Loader2, MoreHorizontal } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu";
import { doc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";

export type ModifiedSales = {
  id: string;
  businessID: string;
  customerID: string;
  status: "paid" | "pending" | undefined;
  createdAt: Timestamp | string | undefined;
  customer: string | undefined;
  service: string | undefined;
  price: string | undefined;
};

export default function DemoPage() {
  const [data, setData] = useState<ModifiedSales[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);

  async function getData() {
    const salesRef = collection(db, "Sales");
    const options: Intl.DateTimeFormatOptions = {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    };

    try {
      const data = await getDocs(query(salesRef, orderBy("createdAt")));

      const filteredData = data.docs.map((doc) => ({
        ...(doc.data() as ModifiedSales),
        id: doc.id,
      }));
      const salesData = filteredData.map((sales) => ({
        ...sales,
        createdAt: (sales.createdAt as Timestamp)
          .toDate()
          .toLocaleDateString("en-GB", options),
      }));

      return setData(salesData);
    } catch (error) {
      console.log(error);
      return [];
    }
  }

  useEffect(() => {
    getData();
  }, []);

  const columns: ColumnDef<ModifiedSales>[] = [
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
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("price"));
        const formatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(amount);

        return <div className="font-medium">{formatted}</div>;
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const payment = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                disabled={isLoading}
                variant="ghost"
                className="h-8 w-8 p-0 self-end"
              >
                <span className="sr-only">Open menu</span>

                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <MoreHorizontal className="h-4 w-4" />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={async () => {
                  try {
                    await setLoading(true);
                    const saleDoc = doc(db, "Sales", payment.id);
                    await updateDoc(saleDoc, {
                      status: payment.status === "paid" ? "pending" : "paid",
                    });
                    await getData();
                    await setLoading(false);
                  } catch (err) {
                    await setLoading(false);
                    console.log(err);
                  }
                }}
              >
                Mark as {payment.status === "paid" ? "pending" : "paid"}
              </DropdownMenuItem>
              <DropdownMenuItem>Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <div className="space-y-6 p-10 pb-16">
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">Sales</h2>
        <p className="text-muted-foreground">
          Get a snapshot of your sales details.
        </p>
      </div>
      <Separator className="sm:my-6" />
      <div className="sm:container mx-auto py-10">
        <DataTable columns={columns} data={data} />
      </div>
    </div>
  );
}
