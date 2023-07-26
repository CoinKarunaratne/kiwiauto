"use client";

import { FC, useState } from "react";
import BusinessSwitcher from "./business-switcher";
import { MainNav } from "./main-nav";
import MobileNavigation from "./MobileNavigation";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "./ui/button";
import Link from "next/link";
import { PlusCircle } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";

interface NavigationProps {}

const Navigation: FC<NavigationProps> = ({}) => {
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
    <div className="border-b">
      <div className="hidden lg:flex h-16 items-center px-4">
        <BusinessSwitcher />
        <MainNav className="mx-6" />
        <div className="ml-auto flex items-center space-x-4">
          <ThemeToggle />
          <Button
            isLoading={isLoading}
            className="dark:bg-green-800 bg-black text-white"
            variant="outline"
            onClick={handleLogout}
          >
            Log out
          </Button>
        </div>
      </div>
      <div className="lg:hidden flex h-16 items-center px-4 justify-between">
        <BusinessSwitcher />
        <div className="ml-auto flex items-center space-x-4">
          <Link href="/add">
            <PlusCircle className="h-5 w-5" />
          </Link>
          <MobileNavigation />
        </div>
      </div>
    </div>
  );
};

export default Navigation;
