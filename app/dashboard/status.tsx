import { FC, useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Calculator, DollarSign, BarChart, PieChart } from "lucide-react";

import { Sale } from "./page";
import { useSelector } from "react-redux";
import { CustomerFormValues } from "../add/customer/customerForm";
import { Timestamp } from "firebase/firestore";
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
  salesCount: number | undefined;
  salesCountDiff: number | undefined;
  currentSalesCount: number | undefined;
  currentSalesCountDiff: number | undefined;
  totalCost: number | undefined;
  totalCostDiff: number | undefined;
  currentCost: number | undefined;
  currentCostDiff: number | undefined;
  totalProfit: number | undefined;
  totalProfitDiff: number | undefined;
  currentProfit: number | undefined;
  currentProfitDiff: number | undefined;
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

  const [totalSales, setTotalSales] = useState<TotalSales>({
    totalRevenue: 0,
    totalRevenueDiff: 0,
    currentRevenue: 0,
    currentRevenueDiff: 0,
    salesCount: 0,
    salesCountDiff: 0,
    currentSalesCount: 0,
    currentSalesCountDiff: 0,
    totalCost: 0,
    totalCostDiff: 0,
    currentCost: 0,
    currentCostDiff: 0,
    totalProfit: 0,
    totalProfitDiff: 0,
    currentProfit: 0,
    currentProfitDiff: 0,
  });
  const [isLastMonth, setLastMonth] = useState<boolean>(false);

  useEffect(() => {
    const currentBusinessSales = sales?.filter(
      (doc) => doc.businessID === businessID
    );
    const lastMonthBusinessSales = sales?.filter((doc) => {
      const docDate = doc.createdAt;
      const docMonth = docDate.getMonth() + 1;
      return docMonth < currentMonth;
    });
    if (lastMonthBusinessSales?.length === 0) {
      setLastMonth(true);
    }
    const lastMonthCurrentBusinessSales = currentBusinessSales?.filter(
      (doc) => {
        const docDate = doc.createdAt;
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

    const totalCost = sales?.reduce(
      (total, obj) => total + parseFloat(obj.cost),
      0
    );
    const lastMonthCost = lastMonthBusinessSales?.reduce(
      (total, obj) => total + parseFloat(obj.cost),
      0
    );
    const totalCostDiff =
      totalCost !== undefined && lastMonthCost !== undefined
        ? ((totalCost - lastMonthCost) / lastMonthCost) * 100
        : 0;

    const currentCost = currentBusinessSales?.reduce(
      (total, obj) => total + parseFloat(obj.cost),
      0
    );
    const lastMonthCurrentCost = lastMonthCurrentBusinessSales?.reduce(
      (total, obj) => total + parseFloat(obj.cost),
      0
    );

    const currentCostDiff =
      currentCost !== undefined && lastMonthCurrentCost !== undefined
        ? ((currentCost - lastMonthCurrentCost) / lastMonthCurrentCost) * 100
        : 0;

    const totalProfit = sales?.reduce(
      (total, obj) => total + parseFloat(obj.profit),
      0
    );
    const lastMonthProfit = lastMonthBusinessSales?.reduce(
      (total, obj) => total + parseFloat(obj.profit),
      0
    );
    const totalProfitDiff =
      totalProfit !== undefined && lastMonthProfit !== undefined
        ? ((totalProfit - lastMonthProfit) / lastMonthProfit) * 100
        : 0;

    const currentProfit = currentBusinessSales?.reduce(
      (total, obj) => total + parseFloat(obj.profit),
      0
    );
    const lastMonthCurrentProfit = lastMonthCurrentBusinessSales?.reduce(
      (total, obj) => total + parseFloat(obj.profit),
      0
    );

    const currentProfitDiff =
      currentProfit !== undefined && lastMonthCurrentProfit !== undefined
        ? ((currentProfit - lastMonthCurrentProfit) / lastMonthCurrentProfit) *
          100
        : 0;

    setTotalSales({
      totalRevenue,
      totalRevenueDiff,
      currentRevenue,
      currentRevenueDiff,
      salesCount,
      salesCountDiff,
      currentSalesCount,
      currentSalesCountDiff,
      totalCost,
      totalCostDiff,
      currentCost,
      currentCostDiff,
      totalProfit,
      totalProfitDiff,
      currentProfit,
      currentProfitDiff,
    });
  }, [sales, businessID, currentMonth, salesLoading]);

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
              +{isLastMonth ? 0 : totalSales.totalRevenueDiff?.toFixed(2)}% from
              last month
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
              +{isLastMonth ? 0 : totalSales.currentRevenueDiff?.toFixed(2)}%
              from last month
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
              +{isLastMonth ? 0 : totalSales.salesCountDiff?.toFixed(2)}% from
              last month
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
              +{isLastMonth ? 0 : totalSales.currentSalesCountDiff?.toFixed(2)}%
              from last month
            </p>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Cost</CardTitle>
          <BarChart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold"> +{totalSales.totalCost}</div>
          {date?.from === undefined && (
            <p className="text-xs text-muted-foreground">
              +{isLastMonth ? 0 : totalSales.totalCostDiff?.toFixed(2)}% from
              last month
            </p>
          )}
        </CardContent>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {businessName} Cost
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">+{totalSales.currentCost}</div>
          {date?.from === undefined && (
            <p className="text-xs text-muted-foreground">
              +{isLastMonth ? 0 : totalSales.currentCostDiff?.toFixed(2)}% from
              last month
            </p>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Profit</CardTitle>
          <PieChart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold"> +{totalSales.totalProfit}</div>
          {date?.from === undefined && (
            <p className="text-xs text-muted-foreground">
              +{isLastMonth ? 0 : totalSales.totalProfitDiff?.toFixed(2)}% from
              last month
            </p>
          )}
        </CardContent>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {businessName} Profit
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">+{totalSales.currentProfit}</div>
          {date?.from === undefined && (
            <p className="text-xs text-muted-foreground">
              +{isLastMonth ? 0 : totalSales.currentProfitDiff?.toFixed(2)}%
              from last month
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Status;
