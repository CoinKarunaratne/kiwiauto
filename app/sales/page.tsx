import { Sale, columns } from "./columns";
import { DataTable } from "./data-table";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "@/config/firebase";
import { Separator } from "../components/ui/separator";

export type Sales = Sale & {
  id: string;
  businessID: string;
  customerID: string;
};

async function getData(): Promise<Sales[]> {
  const salesRef = collection(db, "Sales");

  try {
    const data = await getDocs(query(salesRef, orderBy("createdAt")));

    const filteredData = data.docs.map((doc) => ({
      ...(doc.data() as Sales),
      id: doc.id,
    }));
    console.log(filteredData);
    return filteredData as Sales[];
  } catch (error) {
    console.log(error);
    return [];
  }
}

export default async function DemoPage() {
  const data = await getData();

  return (
    <div className="space-y-6 p-10 pb-16">
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">Sales</h2>
        <p className="text-muted-foreground">
          Get a snapshot of your sales details.
        </p>
      </div>
      <Separator className="my-6" />
      <div className="container mx-auto py-10">
        <DataTable columns={columns} data={data} />
      </div>
    </div>
  );
}
