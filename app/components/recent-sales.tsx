"use client";

import { carSaleFormValues } from "../add/saleForm";
import { Sale } from "../dashboard/page";
import { Avatar, AvatarFallback } from "./ui/avatar";
import Link from "next/link";
import { useSelector } from "react-redux";

type RecentSalesProps = {
  sales: (Sale[] & carSaleFormValues[]) | undefined;
};

type RootState = {
  businessID: string;
  businessName: string;
};

export function RecentSales({ sales }: RecentSalesProps) {
  const recentSales = sales?.slice(-20);
  const businessID = useSelector((state: RootState) => state.businessID);

  return (
    <div className={`space-y-8 overflow-scroll max-h-[50vh]`}>
      {recentSales?.map((sale, index) => (
        <div key={index} className="flex items-center">
          <Link href={`/customers/${sale.customerID}`}>
            <Avatar className="h-9 w-9">
              <AvatarFallback>OM</AvatarFallback>
            </Avatar>
          </Link>
          <div className="ml-4 space-y-1">
            {sale.businessID === "lS6DOv6PF0HJPdkwEA4o" ? (
              <p className="text-sm font-medium leading-none">
                Car sale customer
              </p>
            ) : (
              <Link href={`/customers/${sale.customerID}`}>
                <p className="text-sm font-medium leading-none">
                  {sale.customer}
                </p>
              </Link>
            )}
            {sale.businessID === "lS6DOv6PF0HJPdkwEA4o" ? (
              <p className="text-sm text-muted-foreground">Car Sale</p>
            ) : (
              <p className="text-sm text-muted-foreground">{sale.service}</p>
            )}
          </div>

          <div className="ml-auto font-medium">+${sale.price}</div>
        </div>
      ))}
    </div>
  );
}
