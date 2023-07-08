"use client";

import Link from "next/link";

import { cn } from "@/lib/utils";
import { useSelector } from "react-redux";

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const businessID = useSelector(
    (state: { businessName: string; businessID: string }) => state.businessID
  );
  return (
    <nav
      className={cn("flex items-center space-x-4 lg:space-x-6", className)}
      {...props}
    >
      <Link
        href="/dashboard"
        className="text-sm font-medium transition-colors hover:text-primary"
      >
        Overview
      </Link>
      <Link
        href="/customers"
        className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        Customers
      </Link>
      <Link
        href="/services"
        className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        Services
      </Link>
      <Link
        href="/sales"
        className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        Sales
      </Link>
      <Link
        href="/add"
        className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        Add New
      </Link>
      <Link
        href={`/settings/${businessID}`}
        className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        Settings
      </Link>
    </nav>
  );
}
