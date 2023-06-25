"use client";

import { Customer, columns } from "./columns";
import { DataTable } from "./data-table";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "@/config/firebase";
import { CustomerFormValues } from "../add/customer/customerForm";
import { Sale } from "../dashboard/page";
import { Separator } from "../components/ui/separator";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const customerRef = collection(db, "Customers");
const salesRef = collection(db, "Sales");

type RootState = {
  businessID: string;
};

async function getData(businessID: string): Promise<Customer[]> {
  try {
    const data = await getDocs(query(customerRef, orderBy("createdAt")));
    const sales = await getDocs(query(salesRef, orderBy("createdAt")));
    const filteredData = data.docs.map((doc) => ({
      ...(doc.data() as CustomerFormValues & {
        businessID: string;
      }),
      id: doc.id,
    }));
    const filteredCustomers = filteredData.filter(
      (doc) => doc.businessID === businessID
    );
    const filteredSalesData = sales.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    })) as Sale[];

    const customerTableData = filteredCustomers.map((doc) => {
      const filteredSales = filteredSalesData?.filter(
        (sale) => sale.customerID === doc.id
      );

      return {
        name: doc.name,
        contact: doc.contact,
        sales: filteredSales?.length,
      };
    });
    console.log(customerTableData);
    return customerTableData as Customer[];
  } catch (error) {
    console.log(error);
    return [];
  }
}

async function getAllCustomers(): Promise<Customer[]> {
  try {
    const data = await getDocs(query(customerRef, orderBy("createdAt")));
    const sales = await getDocs(query(salesRef, orderBy("createdAt")));
    const filteredData = data.docs.map((doc) => ({
      ...(doc.data() as CustomerFormValues & {
        businessID: string;
      }),
      id: doc.id,
    }));

    const filteredSalesData = sales.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    })) as Sale[];

    const customerTableData = filteredData.map((doc) => {
      const filteredSales = filteredSalesData?.filter(
        (sale) => sale.customerID === doc.id
      );

      return {
        name: doc.name,
        contact: doc.contact,
        sales: filteredSales?.length,
      };
    });
    console.log(customerTableData);
    return customerTableData as Customer[];
  } catch (error) {
    console.log(error);
    return [];
  }
}

export default function DemoPage() {
  const businessID = useSelector((state: RootState) => state.businessID);
  const [data, setData] = useState<Customer[]>([]);

  useEffect(() => {
    async function fetchData() {
      const salesData = await getData(businessID);
      setData(salesData);
    }

    fetchData();
  }, [businessID]);

  return (
    <div className="space-y-6 p-10 pb-16">
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">Customers</h2>
        <p className="text-muted-foreground">
          Get a snapshot of your customer details.
        </p>
      </div>
      <Separator className="my-6" />
      <div className="container mx-auto py-10">
        <DataTable columns={columns} data={data} />
      </div>
    </div>
  );
}
