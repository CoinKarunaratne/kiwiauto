"use client";

import { DataTable } from "./data-table";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "@/config/firebase";
import { Separator } from "../components/ui/separator";
import { Timestamp } from "firebase/firestore";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu";

import { useEffect, useState } from "react";
import { ModifiedSales } from "../sales/page";
import { DataTableColumnHeader } from "./column-header";
import Link from "next/link";

export type ModifiedCustomers = {
  id: string;
  businessID: string;
  address: string;
  contact: string;
  createdAt: Timestamp | string | undefined;
  email: string | undefined;
  name: string | undefined;
  type: string | undefined;
  vehicle: string | undefined;
};

export default function DemoPage() {
  const [data, setData] = useState<ModifiedCustomers[]>([]);
  const [sales, setSales] = useState<ModifiedSales[]>([]);

  async function getData() {
    const customersRef = collection(db, "Customers");

    try {
      const data = await getDocs(
        query(customersRef, orderBy("createdAt", "desc"))
      );

      const filteredData = data.docs.map((doc) => ({
        ...(doc.data() as ModifiedCustomers),
        id: doc.id,
      }));

      return setData(filteredData);
    } catch (error) {
      console.log(error);
      return [];
    }
  }

  async function getSales() {
    const salesRef = collection(db, "Sales");

    try {
      const data = await getDocs(query(salesRef, orderBy("createdAt", "desc")));

      const filteredData = data.docs.map((doc) => ({
        ...(doc.data() as ModifiedSales),
        id: doc.id,
      }));

      return setSales(filteredData);
    } catch (error) {
      console.log(error);
      return [];
    }
  }

  useEffect(() => {
    async function fetchData() {
      await getData();
      await getSales();
    }
    fetchData();
  }, []);

  const columns: ColumnDef<ModifiedCustomers>[] = [
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "contact",
      header: "Contact",
    },
    {
      accessorKey: "address",
      header: "Address",
    },
    {
      accessorKey: "type",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Vehicle type" />
      ),
      cell: ({ row }) => {
        const customer = row.original;
        if (!customer.type) {
          return <h1 className="ml-10">-</h1>;
        } else return <h1 className="ml-5">{customer.type}</h1>;
      },
    },
    {
      accessorKey: "sales",
      header: "Sales",
      cell: ({ row }) => {
        const customer = row.original;

        const salesCount = sales.filter(
          (sale) => sale.customerID === customer.id
        );

        return salesCount.length;
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const customer = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0 self-end">
                <span className="sr-only">Open menu</span>

                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem>
                <Link href={`/customers/${customer.id}`}>View customer</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <div className="space-y-6 p-10 pb-16">
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">Customers</h2>
        <p className="text-muted-foreground">
          Get a snapshot of your customers.
        </p>
      </div>
      <Separator className="sm:my-6" />
      <div className="sm:container mx-auto py-10">
        <DataTable columns={columns} data={data} />
      </div>
    </div>
  );
}
