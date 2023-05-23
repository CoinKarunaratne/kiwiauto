"use client";

import Lottie, { LottieRefCurrentProps } from "lottie-react";
import animationData from "@/public/114986-ultimate-trading-experience.json";
import { useRef } from "react";
import Navbar from "./components/Navbar";
import LargeHeading from "./components/ui/LargeHeading";
import Paragraph from "./components/ui/Paragraph";
import Link from "next/link";

export default function Home() {
  const assistantRef = useRef<LottieRefCurrentProps>(null);
  return (
    <main className="relative h-screen flex items-center justify-center overflow-x-hidden">
      <Navbar />
      <div className="container pt-32 max-w-7xl w-full mx-auto h-full">
        <div className="h-full gap-6 flex flex-col justify-start lg:justify-center items-center lg:items-start">
          <LargeHeading
            size="lg"
            className="three-d text-black dark:text-light-gold"
          >
            Kiwi Auto Care <br /> Business App.
          </LargeHeading>

          <Paragraph className="max-w-xl lg:text-left">
            <Link
              href="https://www.kiwiautocare.co.nz/"
              className="underline underline-offset-2 text-black dark:text-light-gold"
            >
              Kiwi Autocare
            </Link>{" "}
            is your ONE STOP solution bringing best car services.
          </Paragraph>

          <div className="relative w-full max-w-xl lg:max-w-3xl lg:left-1/2 aspect-square lg:absolute">
            <Lottie
              className="img-shadow"
              lottieRef={assistantRef}
              animationData={animationData}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
