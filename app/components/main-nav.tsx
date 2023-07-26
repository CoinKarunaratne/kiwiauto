"use client";

import Link from "next/link";

import { cn } from "@/lib/utils";
import { useSelector } from "react-redux";
import { usePathname } from "next/navigation";

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const businessID = useSelector(
    (state: { businessName: string; businessID: string }) => state.businessID
  );
  const pathname = usePathname();
  const navItems = [
    { href: "/dashboard", title: "Overview" },
    { href: "/customers", title: "Customers" },
    { href: "/services", title: "Services" },
    { href: "/sales", title: "Sales" },
    { href: "/add", title: "Add New" },
    { href: `/settings/${businessID}`, title: "Settings" },
  ];
  return (
    <nav
      className={cn("flex items-center space-x-4 lg:space-x-6", className)}
      {...props}
    >
      {navItems.map((item, index) => (
        <Link
          key={index}
          href={item.href}
          className={`text-sm font-medium ${
            pathname != item.href && "text-muted-foreground"
          } transition-colors hover:text-primary`}
        >
          {item.title}
        </Link>
      ))}
    </nav>
  );
}
