import { FC } from "react";
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

interface MobileNavigationProps {}

const MobileNavigation: FC<MobileNavigationProps> = ({}) => {
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
                href="/products"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                Products
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
                href="/settings"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                Settings
              </Link>
            </nav>
          </SheetDescription>
        </SheetHeader>
        <SheetFooter className="absolute bottom-5 w-32">
          <Button className="bg-green-800" variant="outline">
            Log out
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNavigation;
