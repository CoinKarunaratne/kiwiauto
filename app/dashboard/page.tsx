"use client";

import { Download } from "lucide-react";

import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { CalendarDateRangePicker } from "../components/date-range-picker";
import { Overview } from "../components/overview";
import { RecentSales } from "../components/recent-sales";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  collection,
  getDocs,
  orderBy,
  query,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/config/firebase";
import { SaleFormValues } from "../add/saleForm";
import { useEffect, useState } from "react";
import { useToast } from "@/app/components/ui/use-toast";
import Status from "./status";
import { DateRange } from "react-day-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { isSameDay, isWithinInterval } from "date-fns";
import * as XLSX from "xlsx";

export type Sale = SaleFormValues & {
  id: string;
  businessID: string;
  customerID: string;
  createdAt: Timestamp | Date;
  status: "paid" | "pending";
  profit: string;
};

export default function DashboardPage() {
  const [salesLoading, setSalesLoading] = useState<boolean>(false);
  const [years, setYears] = useState<number[]>([]);
  const [chartYear, setChartYear] = useState<string>();
  const [chartMode, setChartMode] = useState<string>("count");
  const [initialData, setInitialData] = useState<any | undefined>([]);
  const [businessSales, setBusinessSales] = useState<Sale[] | undefined>([]);
  const [chartData, setChartData] = useState<Sale[] | undefined>([]);
  const [date, setDate] = useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  });

  const salesRef = collection(db, "Sales");
  const { toast } = useToast();

  const getSalesList = async () => {
    try {
      const data = await getDocs(query(salesRef, orderBy("createdAt", "desc")));
      const filteredData = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      })) as Sale[];
      const yearsSet = new Set();
      const filteredSalesData = filteredData.map((sale) => ({
        ...sale,
        createdAt: (sale.createdAt as Timestamp).toDate(),
      }));
      await filteredSalesData.forEach((item) => {
        const year = item.createdAt.getFullYear();
        yearsSet.add(year);
      });
      const year = Array.from(yearsSet) as number[];
      await setYears(year);
      await setChartYear(year[year.length - 1]?.toString());
      await setInitialData(filteredSalesData);
      return true;
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: JSON.stringify(error),
      });
      return false;
    }
  };

  const salesQuery = useQuery({
    queryKey: ["sales"],
    queryFn: getSalesList,
  });
  const queryClient = useQueryClient();

  useEffect(() => {
    if (salesQuery.isLoading) {
      setSalesLoading(true);
    }

    if (salesQuery.isError) {
      setSalesLoading(true);
    }

    if (salesQuery.isSuccess) {
      setSalesLoading(false);
    }
  }, [salesQuery, queryClient]);

  useEffect(() => {
    function fetchData() {
      if (date?.to === undefined && date?.from === undefined) {
        setBusinessSales(initialData);
      } else if (date?.to === undefined && date?.from != undefined) {
        const rangeData = initialData?.filter((doc: Sale) =>
          isSameDay(doc.createdAt as Date, date?.from as Date)
        );
        setBusinessSales(rangeData);
      } else if (date?.to != undefined && date?.from != undefined) {
        const rangeData = initialData?.filter((doc: Sale) => {
          const { createdAt } = doc;
          if (createdAt) {
            return isWithinInterval(createdAt as Date, {
              start: date?.from as Date,
              end: date?.to as Date,
            });
          }
        });
        setBusinessSales(rangeData);
      } else {
        return;
      }
    }

    fetchData();
  }, [date, initialData]);

  useEffect(() => {
    function fetchChartData() {
      const rangeData = initialData?.filter((doc: any) => {
        const convertedYear = doc.createdAt.getFullYear().toString();
        return convertedYear === chartYear;
      });
      setChartData(rangeData);
    }
    fetchChartData();
  }, [chartYear, initialData, chartMode]);

  const documentDownloader = () => {
    if (businessSales !== undefined) {
      if (businessSales.length === 0) {
        toast({
          title: "Unable to proceed!",
          description: "There are no sales record to show for this period",
        });
        return;
      }
      const options: Intl.DateTimeFormatOptions = {
        year: "numeric",
        month: "long",
        day: "numeric",
      };
      const sales = businessSales.map((item) => {
        const createdAtDate =
          item.createdAt instanceof Date
            ? item.createdAt
            : new Date(item.createdAt);
        return {
          ...item,
          createdAt: createdAtDate.toLocaleDateString("en-US", options),
        };
      });
      var wb = XLSX.utils.book_new(),
        ws = XLSX.utils.json_to_sheet(sales);

      XLSX.utils.book_append_sheet(wb, ws, "Sales-form");
      XLSX.writeFile(wb, "SalesReport.xlsx");
    }
  };

  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 gap-4">
        <h2 className="text-3xl font-bold tracking-tight my-5">Dashboard</h2>
        <div className="flex items-center space-x-2">
          <CalendarDateRangePicker date={date} setDate={setDate} />

          <Button size="sm" onClick={documentDownloader}>
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
        </div>
      </div>
      <div className="sm:hidden">
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="my-10">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="recent sales">Recent Sales</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <Overview
              sales={chartData}
              salesLoading={salesLoading}
              chart={chartMode}
            />
          </TabsContent>
          <TabsContent value="analytics" className="space-y-4">
            <Status
              sales={businessSales}
              salesLoading={salesLoading}
              isMobile={true}
              date={date}
            />
          </TabsContent>
          <TabsContent value="recent sales" className="space-y-4 pt-4">
            <RecentSales sales={initialData} />
          </TabsContent>
        </Tabs>
      </div>
      <Status
        sales={businessSales}
        salesLoading={salesLoading}
        isMobile={false}
        date={date}
      />
      <div className="hidden sm:grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader className="flex flex-col gap-2 pb-2">
            <CardTitle>Overview</CardTitle>
            <CardDescription className="flex flex-row justify-end gap-2">
              {" "}
              <Select
                defaultValue={chartYear?.toString()}
                onValueChange={setChartYear}
              >
                <SelectTrigger className="w-[180px]">
                  <p>{chartYear}</p>
                </SelectTrigger>
                <SelectContent>
                  {years.map((year, index) => (
                    <SelectItem key={index} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                  <SelectItem value="2024">2024</SelectItem>
                  <SelectItem value="2025">2025</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue={chartMode} onValueChange={setChartMode}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="count">Sales Count</SelectItem>
                  <SelectItem value="price">Revenue</SelectItem>
                  <SelectItem value="profit">Profits</SelectItem>
                  <SelectItem value="cost">Costs</SelectItem>
                </SelectContent>
              </Select>
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2 pt-5">
            <Overview
              sales={chartData}
              salesLoading={salesLoading}
              chart={chartMode}
            />
          </CardContent>
        </Card>
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Recent Sales</CardTitle>
            <CardDescription>You made 265 sales this month.</CardDescription>
          </CardHeader>
          <CardContent>
            <RecentSales sales={initialData} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
