"use client";

import { useEffect, useState } from "react";
import { ThemeProvider } from "next-themes";
import type { FC, ReactNode } from "react";
import { Toaster } from "@/app/components/ui/toaster";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

interface ProvidersProps {
  children: ReactNode;
}

const Providers: FC<ProvidersProps> = ({ children }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const queryClient = new QueryClient();

  return (
    <>
      {isMounted && (
        <QueryClientProvider client={queryClient}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            {children}
            <Toaster />
          </ThemeProvider>
        </QueryClientProvider>
      )}
    </>
  );
};

export default Providers;
