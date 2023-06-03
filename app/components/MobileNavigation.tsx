import { FC } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
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
        <Button variant="outline">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle className="mt-10">Navigation</SheetTitle>
          <SheetDescription>
            <nav className="flex flex-col justify-start gap-4 mt-10">
              <Link
                href="/examples/dashboard"
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                Overview
              </Link>
              <Link
                href="/examples/dashboard"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                Customers
              </Link>
              <Link
                href="/examples/dashboard"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                Products
              </Link>
              <Link
                href="/examples/dashboard"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                Sales
              </Link>
              <Link
                href="/examples/dashboard"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                Settings
              </Link>
            </nav>
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNavigation;
