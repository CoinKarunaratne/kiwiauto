"use client";

import { Customer, columns } from "./columns";
import { DataTable } from "./data-table";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "@/config/firebase";
import { CustomerFormValues } from "../add/customer/customerForm";
import { useQueryClient, QueryClient } from "@tanstack/react-query";
import { Sale } from "../dashboard/page";

const businessRef = collection(db, "Customers");

async function getData(queryClient: QueryClient): Promise<Customer[]> {
  try {
    const data = await getDocs(query(businessRef, orderBy("createdAt")));
    const filteredData = data.docs.map((doc) => ({
      ...(doc.data() as CustomerFormValues),
      id: doc.id,
    }));
    const customerTableData = filteredData.map((doc) => {
      queryClient.invalidateQueries(["sales"]);
      queryClient.refetchQueries(["sales"]);
      const updatedSales = queryClient.getQueryData<Sale[]>(["sales"]);
      const filteredSales = updatedSales?.filter(
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

export default async function DemoPage() {
  const queryClient = useQueryClient();

  const data = await getData(queryClient);

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} />
    </div>
  );
}
