"use client";

import { useEffect, useState } from "react";

import { Sale } from "../dashboard/page";
import { Avatar, AvatarFallback } from "./ui/avatar";
import Link from "next/link";

type RecentSalesProps = {
  sales: Sale[] | undefined;
};

export function RecentSales({ sales }: RecentSalesProps) {
  const recentSales = sales?.slice(-20);

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
            <Link href={`/customers/${sale.customerID}`}>
              <p className="text-sm font-medium leading-none">
                {sale.customer}
              </p>
            </Link>
            <p className="text-sm text-muted-foreground">{sale.service}</p>
          </div>

          <div className="ml-auto font-medium">+${sale.price}</div>
        </div>
      ))}
    </div>
  );
}
