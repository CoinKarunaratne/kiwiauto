"use client";

import { DataTable } from "./data-table";
import {
  Timestamp,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "@/config/firebase";
import { Separator } from "../../components/ui/separator";
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/app/components/ui/tabs";
import { useToast } from "@/app/components/ui/use-toast";
import { useEffect, useRef, useState } from "react";
import { ModifiedSales } from "../../sales/page";
import { DataTableColumnHeader } from "./column-header";
import { Badge } from "@/app/components/ui/badge";

export type ModifiedCustomers = {
  id: string;
  businessID: string;
  address: string | undefined;
  contact: string;
  createdAt: Timestamp | string | undefined;
  email: string | undefined;
  name: string;
  type: string | undefined;
  vehicle: string | undefined;
};

type URL = {
  params: {
    id: string;
  };
};

export default function DemoPage(url: URL) {
  const [customer, setCustomer] = useState<ModifiedCustomers>({
    id: "",
    businessID: "",
    address: "",
    contact: "",
    createdAt: "",
    email: "",
    name: "",
    type: "",
    vehicle: "",
  });
  const [sales, setSales] = useState<ModifiedSales[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);

  const dialogRef = useRef<{ [key: string]: HTMLElement | null }>({});
  const { toast } = useToast();

  async function getData(id: string) {
    const docRef = doc(db, "Customers", id);
    const customerDoc = await getDoc(docRef);

    return setCustomer({
      ...(customerDoc.data() as ModifiedCustomers),
      id: customerDoc.id,
    });
  }

  async function getSales(id: string) {
    const salesRef = collection(db, "Sales");

    try {
      if (id !== undefined) {
        console.log(id);
        const data = await getDocs(
          query(salesRef, where("customerID", "==", id), orderBy("createdAt"))
        );

        const filteredData = data.docs.map((doc) => ({
          ...(doc.data() as ModifiedSales),
          id: doc.id,
        }));

        return setSales(filteredData);
      } else {
        return [];
      }
    } catch (error) {
      console.log(error);
      return [];
    }
  }

  useEffect(() => {
    async function fetchData() {
      await getData(url.params.id);
      await getSales(url.params.id);
    }
    fetchData();
  }, [url.params.id]);

  const columns: ColumnDef<ModifiedSales>[] = [
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const sale = row.original;
        if (sale.status === "paid") {
          return <Badge className="bg-green-500">{sale.status}</Badge>;
        } else {
          return <Badge className="bg-amber-400">{sale.status}</Badge>;
        }
      },
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Date" />
      ),
      cell: ({ row }) => {
        const sale = row.original;
        const options: Intl.DateTimeFormatOptions = {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        };
        const formatted = (sale.createdAt as Timestamp)
          .toDate()
          .toLocaleDateString("en-GB", options);

        return <div className="font-medium">{formatted}</div>;
      },
    },
    {
      accessorKey: "service",
      header: "Service",
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
                        await getSales(customer.id);
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
                      await getSales(customer.id);
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

  return (
    <div className="space-y-6 p-10 pb-16">
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">{customer?.name}</h2>
        <p className="text-muted-foreground">
          Here are the customer details of {customer?.name}
        </p>
      </div>
      <Separator className="sm:my-6" />
      <div className="container hidden md:flex mx-auto h-5 text-base justify-center space-x-4">
        <div>{customer?.address}</div>
        <Separator orientation="vertical" />
        <div>{customer?.email}</div>
        <Separator orientation="vertical" />
        <div>{customer?.contact}</div>
        <Separator orientation="vertical" />
        <div>
          {customer?.vehicle}{" "}
          <span className="font-bold">{customer?.type}</span>
        </div>
      </div>

      <div className="container hidden md:grid mx-auto py-10">
        <DataTable columns={columns} data={sales} />
      </div>
      <div className="md:hidden">
        <Tabs defaultValue="details" className="space-y-4">
          <TabsList>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="sales">Sales</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-4 pt-14">
            <div className="grid">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium"></CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-2 text-sm">
                  <div>{customer?.address}</div>
                  <Separator />
                  <div>{customer?.email}</div>
                  <Separator />
                  <div>{customer?.contact}</div>
                  <Separator />
                  <div>
                    {customer?.vehicle}{" "}
                    <span className="font-bold">{customer?.type}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="sales" className="space-y-4 pt-4">
            <div className="container mx-auto py-10">
              <DataTable columns={columns} data={sales} />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}