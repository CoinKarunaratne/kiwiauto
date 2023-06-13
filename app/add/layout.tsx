import "../globals.css";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import Providers from "@/lib/Providers";
import Navigation from "../components/Navigation";
import { Separator } from "../components/ui/separator";
import { SidebarNav } from "../components/ui/sidebar-nav";

const inter = Inter({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-sen",
});

export const metadata = {
  title: "Add New",
  description: "Kiwiautocare dashboard",
};

const sidebarNavItems = [
  {
    title: "Sale",
    href: "/add",
  },
  {
    title: "Service",
    href: "/add/service",
  },
  {
    title: "Customer",
    href: "/add/customer",
  },
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning={true}
      className={cn("bg-white text-slate-900 antialiased", inter.className)}
    >
      <body
        suppressHydrationWarning={true}
        className="min-h-screen h-auto bg-slate-50 dark:bg-[rgb(3,7,17)] antialiased"
      >
        <Providers>
          <div className="flex-col flex min-h-screen h-auto">
            <Navigation />

            <div className="space-y-6 p-10 pb-16">
              <div className="space-y-0.5">
                <h2 className="text-2xl font-bold tracking-tight">Add New</h2>
                <p className="text-muted-foreground">
                  Update your corporate account with your most recent
                  information.
                </p>
              </div>
              <Separator className="my-6" />
              <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
                <aside className="-mx-4 lg:w-1/5">
                  <SidebarNav items={sidebarNavItems} />
                </aside>
                <div className="flex-1 lg:max-w-2xl">{children}</div>
              </div>
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
