import { FC } from "react";
import { Search } from "./search";
import BusinessSwitcher from "./business-switcher";
import { MainNav } from "./main-nav";
import MobileNavigation from "./MobileNavigation";

interface NavigationProps {}

const Navigation: FC<NavigationProps> = ({}) => {
  return (
    <div className="border-b">
      <div className="hidden lg:flex h-16 items-center px-4">
        <BusinessSwitcher />
        <MainNav className="mx-6" />
        <div className="ml-auto flex items-center space-x-4">
          <Search />
        </div>
      </div>
      <div className="lg:hidden flex h-16 items-center px-4 justify-between">
        <BusinessSwitcher />
        <MobileNavigation />
      </div>
    </div>
  );
};

export default Navigation;
