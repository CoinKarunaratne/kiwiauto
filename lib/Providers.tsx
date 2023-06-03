"use client";

import { useEffect, useState } from "react";
import { ThemeProvider } from "next-themes";
import type { FC, ReactNode } from "react";
import { Toaster } from "@/app/components/ui/toaster";

interface ProvidersProps {
  children: ReactNode;
}

const Providers: FC<ProvidersProps> = ({ children }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <>
      {isMounted && (
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
          <Toaster />
        </ThemeProvider>
      )}
    </>
  );
};

export default Providers;
