import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";
import { buttonVariants } from "./ui/button";

function Navbar() {
  return (
    <div className="fixed backdrop-blur-sm bg-white/75 dark:bg-[rgb(3,7,17)] z-50 top-0 left-0 right-0 h-20 border-b border-slate-300 dark:border-slate-700 shadow-sm flex items-center justify-between">
      <div className="container max-w-7xl mx-auto w-full flex justify-between items-center">
        <Link href="/" className={buttonVariants({ variant: "link" })}>
          Kiwi Auto Care App
        </Link>

        <ThemeToggle />
      </div>
    </div>
  );
}

export default Navbar;
