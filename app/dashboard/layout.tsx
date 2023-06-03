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
  title: "Dashboard",
  description: "Kiwiautocare dashboard",
};

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
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
