"use client";

import { FC, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { Menu } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";
import { useSelector } from "react-redux";
import { usePathname, useRouter } from "next/navigation";
import axios from "axios";

interface MobileNavigationProps {}

const MobileNavigation: FC<MobileNavigationProps> = ({}) => {
  const businessID = useSelector(
    (state: { businessName: string; businessID: string }) => state.businessID
  );
  const pathname = usePathname();
  const navItems = [
    { href: "/dashboard", title: "Overview" },
    { href: "/customers", title: "Customers" },
    { href: "/services", title: "Services" },
    { href: "/sales", title: "Sales" },
    { href: `/settings/${businessID}`, title: "Settings" },
  ];

  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await setIsLoading(true);
      await axios.get("/api/logout");
      await router.push("/");
      await setIsLoading(false);
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <Sheet>
      <SheetTrigger>
        <Menu className="h-5 w-5" />
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle className="mt-10">Navigation</SheetTitle>
          <SheetDescription>
            <nav className="flex flex-col justify-start gap-4 mt-10">
              {navItems.map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  className={`text-sm font-medium ${
                    pathname != item.href
                      ? "text-muted-foreground"
                      : "text-primary"
                  } transition-colors hover:text-primary`}
                >
                  {item.title}
                </Link>
              ))}
            </nav>
          </SheetDescription>
        </SheetHeader>
        <SheetFooter className="absolute bottom-5 w-32">
          <Button
            isLoading={isLoading}
            className="bg-green-800"
            variant="outline"
            onClick={handleLogout}
          >
            Log out
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNavigation;
