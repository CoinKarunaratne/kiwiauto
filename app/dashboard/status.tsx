import { FC, useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Calculator, Car, DollarSign, Users } from "lucide-react";

import { Sale } from "./page";
import { useSelector } from "react-redux";
import { CustomerFormValues } from "../add/customer/customerForm";
import {
  collection,
  getDocs,
  orderBy,
  query,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/config/firebase";
import { useToast } from "@/app/components/ui/use-toast";
import { ServiceFormValues } from "../add/service/serviceForm";
import { DateRange } from "react-day-picker";

interface statusProps {
  sales: Sale[] | undefined;
  salesLoading: boolean;
  isMobile: boolean;
  date: DateRange | undefined;
}

export type Customer = CustomerFormValues & {
  businessID: string;
  createdAt: Timestamp;
};

export type Service = ServiceFormValues & {
  businessID: string;
};

export type TotalSales = {
  totalRevenue: number | undefined;
  totalRevenueDiff: number | undefined;
  currentRevenue: number | undefined;
  currentRevenueDiff: number | undefined;
  totalCustomers: number | undefined;
  customersDiff: number | undefined;
  totalCurrentCustomers: number | undefined;
  currentCustomersDiff: number | undefined;
  salesCount: number | undefined;
  salesCountDiff: number | undefined;
  currentSalesCount: number | undefined;
  currentSalesCountDiff: number | undefined;
  servicesCount: number | undefined;
  currentServicesCount: number | undefined;
};

const Status: FC<statusProps> = ({ sales, salesLoading, isMobile, date }) => {
  const businessID = useSelector(
    (state: { businessName: string; businessID: string }) => state.businessID
  );
  const businessName = useSelector(
    (state: { businessName: string; businessID: string }) => state.businessName
  );

  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const { toast } = useToast();

  const [totalSales, setTotalSales] = useState<TotalSales>({
    totalRevenue: 0,
    totalRevenueDiff: 0,
    currentRevenue: 0,
    currentRevenueDiff: 0,
    totalCustomers: 0,
    customersDiff: 0,
    totalCurrentCustomers: 0,
    currentCustomersDiff: 0,
    salesCount: 0,
    salesCountDiff: 0,
    currentSalesCount: 0,
    currentSalesCountDiff: 0,
    servicesCount: 0,
    currentServicesCount: 0,
  });
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    const customersRef = collection(db, "Customers");
    const getCustomersList = async () => {
      try {
        const data = await getDocs(query(customersRef, orderBy("createdAt")));
        const filteredData = data.docs.map((doc) => ({
          ...doc.data(),
        })) as Customer[];
        await setCustomers(filteredData);
        return;
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: JSON.stringify(error),
        });
      }
    };
    getCustomersList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const servicesRef = collection(db, "Services");
    const getServicesList = async () => {
      try {
        const data = await getDocs(query(servicesRef, orderBy("createdAt")));
        const filteredData = data.docs.map((doc) => ({
          ...doc.data(),
        })) as Service[];
        await setServices(filteredData);
        return;
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: JSON.stringify(error),
        });
      }
    };
    getServicesList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const currentBusinessSales = sales?.filter(
      (doc) => doc.businessID === businessID
    );
    const lastMonthBusinessSales = sales?.filter((doc) => {
      const docDate = doc.createdAt.toDate();
      const docMonth = docDate.getMonth() + 1;
      return docMonth < currentMonth;
    });
    const lastMonthCurrentBusinessSales = currentBusinessSales?.filter(
      (doc) => {
        const docDate = doc.createdAt.toDate();
        const docMonth = docDate.getMonth() + 1;
        return docMonth < currentMonth;
      }
    );
    const totalRevenue = sales?.reduce(
      (total, obj) => total + parseFloat(obj.price),
      0
    );
    const lastMonthRevenue = lastMonthBusinessSales?.reduce(
      (total, obj) => total + parseFloat(obj.price),
      0
    );
    const totalRevenueDiff =
      totalRevenue !== undefined && lastMonthRevenue !== undefined
        ? ((totalRevenue - lastMonthRevenue) / lastMonthRevenue) * 100
        : 0;

    const currentRevenue = currentBusinessSales?.reduce(
      (total, obj) => total + parseFloat(obj.price),
      0
    );
    const lastMonthCurrentRevenue = lastMonthCurrentBusinessSales?.reduce(
      (total, obj) => total + parseFloat(obj.price),
      0
    );

    const currentRevenueDiff =
      currentRevenue !== undefined && lastMonthCurrentRevenue !== undefined
        ? ((currentRevenue - lastMonthCurrentRevenue) /
            lastMonthCurrentRevenue) *
          100
        : 0;

    const salesCount = sales?.length;
    const salesCountDiff =
      salesCount !== undefined && lastMonthBusinessSales !== undefined
        ? ((salesCount - lastMonthBusinessSales?.length) /
            lastMonthBusinessSales?.length) *
          100
        : 0;

    const currentSalesCount = currentBusinessSales?.length;
    const currentSalesCountDiff =
      currentSalesCount !== undefined &&
      lastMonthCurrentBusinessSales !== undefined
        ? ((currentSalesCount - lastMonthCurrentBusinessSales?.length) /
            lastMonthCurrentBusinessSales?.length) *
          100
        : 0;

    const totalCustomers = customers?.length;
    const currentCustomers = customers?.filter(
      (doc) => doc.businessID === businessID
    );
    const totalCurrentCustomers = currentCustomers.length;
    const lastMonthCustomers = customers?.filter((doc) => {
      const docDate = doc.createdAt.toDate();
      const docMonth = docDate.getMonth() + 1;
      return docMonth < currentMonth;
    });
    const lastMonthCurrentCustomers = currentCustomers?.filter((doc) => {
      const docDate = doc.createdAt.toDate();
      const docMonth = docDate.getMonth() + 1;
      return docMonth < currentMonth;
    });

    const customersDiff =
      ((totalCustomers - lastMonthCustomers?.length) /
        lastMonthCustomers?.length) *
      100;

    const currentCustomersDiff =
      ((totalCurrentCustomers - lastMonthCurrentCustomers?.length) /
        lastMonthCurrentCustomers?.length) *
      100;

    const servicesCount = services.length;
    const currentServices = services.filter(
      (doc) => doc.businessID === businessID
    );
    const currentServicesCount = currentServices?.length;

    setTotalSales({
      totalRevenue,
      totalRevenueDiff,
      currentRevenue,
      currentRevenueDiff,
      totalCustomers,
      customersDiff,
      totalCurrentCustomers,
      currentCustomersDiff,
      salesCount,
      salesCountDiff,
      currentSalesCount,
      currentSalesCountDiff,
      servicesCount,
      currentServicesCount,
    });
  }, [sales, businessID, currentMonth, customers, salesLoading, services]);

  return (
    <div
      className={`${
        isMobile ? "sm:hidden" : "hidden sm:grid"
      } grid gap-4 md:grid-cols-2 lg:grid-cols-4`}
    >
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            ${totalSales.totalRevenue?.toFixed(2)}
          </div>
          {date?.from === undefined && (
            <p className="text-xs text-muted-foreground">
              +{totalSales.totalRevenueDiff?.toFixed(2)}% from last month
            </p>
          )}
        </CardContent>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {businessName} Revenue
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            ${totalSales.currentRevenue?.toFixed(2)}
          </div>
          {date?.from === undefined && (
            <p className="text-xs text-muted-foreground">
              +{totalSales.currentRevenueDiff?.toFixed(2)}% from last month
            </p>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total Sales Count
          </CardTitle>
          <Calculator className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">+{totalSales.salesCount}</div>
          {date?.from === undefined && (
            <p className="text-xs text-muted-foreground">
              +{totalSales.salesCountDiff?.toFixed(2)}% from last month
            </p>
          )}
        </CardContent>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {businessName} Sales Count
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            +{totalSales.currentSalesCount}
          </div>
          {date?.from === undefined && (
            <p className="text-xs text-muted-foreground">
              +{totalSales.currentSalesCountDiff?.toFixed(2)}% from last month
            </p>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {" "}
            +{totalSales.totalCustomers}
          </div>
          {date?.from === undefined && (
            <p className="text-xs text-muted-foreground">
              +{totalSales.customersDiff?.toFixed(2)}% from last month
            </p>
          )}
        </CardContent>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {businessName} Customers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            +{totalSales.totalCurrentCustomers}
          </div>
          {date?.from === undefined && (
            <p className="text-xs text-muted-foreground">
              +{totalSales.currentCustomersDiff?.toFixed(2)}% from last month
            </p>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Services</CardTitle>
          <Car className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">+{totalSales.servicesCount}</div>
        </CardContent>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {businessName} Services
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            +{totalSales.currentServicesCount}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Status;
