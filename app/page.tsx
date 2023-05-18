"use client";

import Lottie, { LottieRefCurrentProps } from "lottie-react";
import animationData from "@/public/114986-ultimate-trading-experience.json";
import { useRef } from "react";

export default function Home() {
  const assistantRef = useRef<LottieRefCurrentProps>(null);
  return (
    <main className="flex min-h-screen flex-col md:flex-row items-center justify-between p-24">
      <div className="w-auto">
        <h1 className="text-2xl font-bold">Kiwi Auto Care</h1>
        <p>Official Business App</p>
      </div>
      <div>
        <Lottie lottieRef={assistantRef} animationData={animationData} />
      </div>
    </main>
  );
}
