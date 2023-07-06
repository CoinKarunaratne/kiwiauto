"use client";

import { DataTable } from "./data-table";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/config/firebase";
import { Separator } from "../components/ui/separator";
import { Timestamp } from "firebase/firestore";
import { ColumnDef } from "@tanstack/react-table";
import { Check, Delete, DeleteIcon, Edit, Loader2, X } from "lucide-react";
import { Button } from "@/app/components/ui/button";
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
import { useEffect, useState } from "react";
import { ModifiedSales } from "../sales/page";
import { useToast } from "@/app/components/ui/use-toast";
import { Input } from "../components/ui/input";

export type Services = {
  id: string;
  businessID: string;
  createdAt: Timestamp;
  customers: [];
  description: string | undefined;
  fee: string;
  name: string;
};

type fee = {
  id: string;
  fee: string;
  visibility: boolean;
};

export default function DemoPage() {
  const [data, setData] = useState<Services[]>([]);
  const [sales, setSales] = useState<ModifiedSales[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [editValue, setEditValue] = useState<fee[]>();
  const { toast } = useToast();

  async function getData() {
    const servicesRef = collection(db, "Services");

    try {
      const data = await getDocs(
        query(servicesRef, orderBy("createdAt", "desc"))
      );

      const filteredData = data.docs.map((doc) => ({
        ...(doc.data() as Services),
        id: doc.id,
      }));
      await setEditValue(() =>
        filteredData.map((doc) => ({
          id: doc.id,
          visibility: false,
          fee: doc.fee,
        }))
      );
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

  const columns: ColumnDef<Services>[] = [
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "description",
      header: "Description",
    },
    {
      accessorKey: "fee",
      header: "Price",
      cell: ({ row }) => {
        const service = row.original;
        const id = editValue?.find((doc) => doc.id === service.id);
        if (!id?.visibility) {
          return (
            <Button
              variant="ghost"
              className="h-8 self-end"
              onClick={() =>
                setEditValue((doc) =>
                  doc?.map((value) => {
                    if (value.id === id?.id) {
                      return { ...value, visibility: true };
                    }
                    return value;
                  })
                )
              }
            >
              <span className="sr-only">Open menu</span>

              {service.fee}
            </Button>
          );
        } else {
          return (
            <div className="flex gap-2">
              <Input
                value={id?.fee}
                onChange={(e) =>
                  setEditValue((doc) =>
                    doc?.map((value) => {
                      if (value.id === id?.id) {
                        return { ...value, fee: e.target.value };
                      }
                      return value;
                    })
                  )
                }
                className="h-8 w-auto text-center"
              />
              <div className="flex h-8 w-16">
                <Button
                  variant="ghost"
                  className="h-8 w-8 p-0 self-end"
                  onClick={async () => {
                    try {
                      await setLoading(true);
                      const serviceDoc = doc(db, "Services", service.id);
                      await updateDoc(serviceDoc, {
                        fee: id.fee,
                      });
                      await getData();
                      await setLoading(false);
                      toast({
                        title: "Success!",
                        description: "Successfully updated.",
                      });
                    } catch (err) {
                      toast({
                        variant: "destructive",
                        title: "Failed Update!",
                      });
                      console.log(err);
                    }
                  }}
                >
                  <span className="sr-only">Open menu</span>

                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Check color="green" className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  onClick={() =>
                    setEditValue((doc) =>
                      doc?.map((value) => {
                        if (value.id === id?.id) {
                          return { ...value, visibility: false };
                        }
                        return value;
                      })
                    )
                  }
                  variant="ghost"
                  className="h-8 w-8 p-0 self-end"
                >
                  <span className="sr-only">Open menu</span>

                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          );
        }
      },
    },
    {
      accessorKey: "customers",
      header: "Active customers",
      cell: ({ row }) => {
        const service = row.original;

        return service.customers.length;
      },
    },
    {
      accessorKey: "name",
      header: "Active sales",
      cell: ({ row }) => {
        const service = row.original;

        const salesCount = sales.filter(
          (sale) => sale.service === service.name
        );

        return salesCount.length;
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const service = row.original;

        return (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0 self-end">
                <span className="sr-only">Open menu</span>

                <Delete color="red" className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This service will be erased
                  permenantly.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  disabled={isLoading}
                  onClick={async () => {
                    try {
                      await setLoading(true);
                      const deleteServiceDoc = doc(db, "Services", service.id);
                      await deleteDoc(deleteServiceDoc);
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
        );
      },
    },
  ];

  return (
    <div className="space-y-6 p-10 pb-16">
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">Services</h2>
        <p className="text-muted-foreground">
          Get a snapshot of your services.
        </p>
      </div>
      <Separator className="sm:my-6" />
      <div className="sm:container mx-auto py-10">
        <DataTable columns={columns} data={data} />
      </div>
    </div>
  );
}
