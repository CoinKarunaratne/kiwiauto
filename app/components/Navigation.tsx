import { FC } from "react";
import BusinessSwitcher from "./business-switcher";
import { MainNav } from "./main-nav";
import MobileNavigation from "./MobileNavigation";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "./ui/button";
import Link from "next/link";
import { PlusCircle } from "lucide-react";

interface NavigationProps {}

const Navigation: FC<NavigationProps> = ({}) => {
  return (
    <div className="border-b">
      <div className="hidden lg:flex h-16 items-center px-4">
        <BusinessSwitcher />
        <MainNav className="mx-6" />
        <div className="ml-auto flex items-center space-x-4">
          <ThemeToggle />
          <Button
            className="dark:bg-green-800 bg-black text-white"
            variant="outline"
          >
            Log out
          </Button>
        </div>
      </div>
      <div className="lg:hidden flex h-16 items-center px-4 justify-between">
        <BusinessSwitcher />
        <div className="ml-auto flex items-center space-x-4">
          <Link href="/AddNew">
            <PlusCircle className="h-5 w-5" />
          </Link>
          <MobileNavigation />
        </div>
      </div>
    </div>
  );
};

export default Navigation;
