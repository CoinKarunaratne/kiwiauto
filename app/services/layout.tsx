import "../globals.css";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import Providers from "@/lib/Providers";
import Navigation from "../components/Navigation";

const inter = Inter({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-sen",
});

export const metadata = {
  title: "Customers",
  description: "Kiwiautocare customers",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main
      className={cn(
        "bg-white text-slate-900 dark:text-white antialiased",
        inter.className
      )}
    >
      <div className="min-h-screen h-auto bg-slate-50 dark:bg-[rgb(3,7,17)] antialiased">
        <div className="flex-col flex min-h-screen h-auto">
          <Navigation />
          <Providers>{children}</Providers>
        </div>
      </div>
    </main>
  );
}
