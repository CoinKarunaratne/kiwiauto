"use client";

import { DataTable } from "./data-table";
import {
  collection,
  deleteDoc,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/app/components/ui/alert-dialog";
import { doc, updateDoc } from "firebase/firestore";
import { useEffect, useState, useRef } from "react";
import { useToast } from "@/app/components/ui/use-toast";
import { DataTableColumnHeader } from "./column-header";
import { Badge } from "../components/ui/badge";
import { useSelector } from "react-redux";

export type ModifiedSales = {
  id: string;
  businessID: string;
  customerID: string;
  status: "paid" | "pending" | undefined;
  createdAt: Timestamp | undefined | Date;
  customer: string | undefined;
  service: string | undefined;
  price: string | undefined;
  rego: string | undefined;
};

type RootState = {
  businessID: string;
  businessName: string;
};

export default function DemoPage() {
  const [data, setData] = useState<ModifiedSales[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);

  const dialogRef = useRef<{ [key: string]: HTMLElement | null }>({});
  const { toast } = useToast();

  const businessID = useSelector((state: RootState) => state.businessID);

  async function getData() {
    const salesRef = collection(db, "Sales");

    try {
      const data = await getDocs(query(salesRef, orderBy("createdAt", "desc")));

      const filteredData = data.docs.map((doc) => ({
        ...(doc.data() as ModifiedSales),
        id: doc.id,
      }));
      const salesData = filteredData.map((sales) => ({
        ...sales,
        createdAt: (sales.createdAt as Timestamp).toDate(),
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
      cell: ({ row }) => {
        const sale = row.original;
        if (sale.businessID === "lS6DOv6PF0HJPdkwEA4o") {
          return <Badge className="bg-pink-500">car sale</Badge>;
        } else {
          if (sale.status === "paid") {
            return <Badge className="bg-green-500">{sale.status}</Badge>;
          } else {
            return <Badge className="bg-amber-400">{sale.status}</Badge>;
          }
        }
      },
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Date" />
      ),
      cell: ({ row }) => {
        const options: Intl.DateTimeFormatOptions = {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        };
        const sale = row.original;
        const createdAt =
          sale?.createdAt instanceof Date &&
          sale?.createdAt?.toLocaleDateString("en-GB", options);

        return <div className="font-medium">{createdAt}</div>;
      },
    },
    {
      accessorKey: "customer",
      header: "Customer",
      cell: ({ row }) => {
        const payment = row.original;

        return (
          <div className="font-medium">
            {payment.businessID === "lS6DOv6PF0HJPdkwEA4o"
              ? "car sale customer"
              : payment.customer}
          </div>
        );
      },
    },
    {
      accessorKey: "rego",
      header: "Rego",
      cell: ({ row }) => {
        const payment = row.original;

        return (
          <div className="font-medium">
            {payment.businessID === "lS6DOv6PF0HJPdkwEA4o"
              ? "car sale customer"
              : payment.rego}
          </div>
        );
      },
    },
    {
      accessorKey: "service",
      header: "Service",
      cell: ({ row }) => {
        const payment = row.original;

        return (
          <div className="font-medium">
            {payment.businessID === "lS6DOv6PF0HJPdkwEA4o"
              ? "car sale"
              : payment.service}
          </div>
        );
      },
    },
    {
      accessorKey: "price",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Amount" />
      ),
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
      accessorKey: "cost",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Cost" />
      ),
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("cost"));
        const formatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(amount);

        return <div className="font-medium">{formatted}</div>;
      },
    },
    {
      accessorKey: "profit",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Profit" />
      ),
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("profit"));
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
          <>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  ref={(ref) => (dialogRef.current[payment?.id] = ref)}
                  className="hidden"
                  variant="outline"
                >
                  Show Dialog
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This sales record will be
                    erased permenantly.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={async () => {
                      try {
                        await setLoading(true);
                        const deleteSaleDoc = doc(db, "Sales", payment.id);
                        await deleteDoc(deleteSaleDoc);
                        await getData();
                        await setLoading(false);
                        toast({
                          title: "Success!",
                          description: "Successfully deleted sales record.",
                        });
                      } catch (err) {
                        await setLoading(false);
                        console.log(err);
                      }
                    }}
                  >
                    Continue
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
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
                <DropdownMenuItem
                  className="text-sm text-red-400 cursor-pointer"
                  onClick={() => dialogRef.current[payment.id]?.click()}
                >
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        );
      },
    },
  ];

  const carSaleColumns: ColumnDef<ModifiedSales>[] = [
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Date" />
      ),
      cell: ({ row }) => {
        const options: Intl.DateTimeFormatOptions = {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        };
        const sale = row.original;
        const createdAt =
          sale?.createdAt instanceof Date &&
          sale?.createdAt?.toLocaleDateString("en-GB", options);

        return <div className="font-medium">{createdAt}</div>;
      },
    },
    {
      accessorKey: "rego",
      header: "Rego",
    },
    {
      accessorKey: "price",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Amount" />
      ),
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
      accessorKey: "cost",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Cost" />
      ),
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("cost"));
        const formatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(amount);

        return <div className="font-medium">{formatted}</div>;
      },
    },
    {
      accessorKey: "profit",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Profit" />
      ),
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("profit"));
        const formatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(amount);

        return <div className="font-medium">{formatted}</div>;
      },
    },
    {
      accessorKey: "description",
      header: "Description",
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const payment = row.original;

        return (
          <>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  ref={(ref) => (dialogRef.current[payment?.id] = ref)}
                  className="hidden"
                  variant="outline"
                >
                  Show Dialog
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This sales record will be
                    erased permenantly.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={async () => {
                      try {
                        await setLoading(true);
                        const deleteSaleDoc = doc(db, "Sales", payment.id);
                        await deleteDoc(deleteSaleDoc);
                        await getData();
                        await setLoading(false);
                        toast({
                          title: "Success!",
                          description: "Successfully deleted sales record.",
                        });
                      } catch (err) {
                        await setLoading(false);
                        console.log(err);
                      }
                    }}
                  >
                    Continue
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
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
                  className="text-sm text-red-400 cursor-pointer"
                  onClick={() => dialogRef.current[payment.id]?.click()}
                >
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
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
        <DataTable
          columns={
            businessID === "lS6DOv6PF0HJPdkwEA4o" ? carSaleColumns : columns
          }
          data={data}
        />
      </div>
    </div>
  );
}
