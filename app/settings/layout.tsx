import "../globals.css";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import Providers from "@/lib/Providers";
import Navigation from "../components/Navigation";
import { Separator } from "../components/ui/separator";
import React from "react";
import Setup from "./[id]/setup";

const inter = Inter({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-sen",
});

export const metadata = {
  title: "Settings",
  description: "Business settings",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main
      className={cn(
        "bg-white text-slate-900 antialiased dark:text-white",
        inter.className
      )}
    >
      <Providers>
        <div className="min-h-screen h-auto bg-slate-50 dark:bg-[rgb(3,7,17)] antialiased">
          <div className="flex-col flex min-h-screen h-auto">
            <Navigation />
            <div className="space-y-6 p-10 pb-16">
              <div className="space-y-0.5">
                <h2 className="text-2xl font-bold tracking-tight">
                  Current Businesses
                </h2>
                <p className="text-muted-foreground">
                  Update your business accounts.
                </p>
              </div>
              <Separator className="my-6" />
              <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
                <Setup />
                <div className="flex-1 lg:max-w-2xl">{children}</div>
              </div>
            </div>
          </div>
        </div>
      </Providers>
    </main>
  );
}
