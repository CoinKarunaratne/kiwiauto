"use client";

import { FC } from "react";
import Lottie, { LottieRefCurrentProps } from "lottie-react";
import animationData from "@/public/114986-ultimate-trading-experience.json";
import { useRef } from "react";

interface LottieProps {}

const LottieComponent: FC<LottieProps> = ({}) => {
  const assistantRef = useRef<LottieRefCurrentProps>(null);
  return (
    <div className="relative w-full max-w-xl lg:max-w-3xl lg:left-1/2 aspect-square lg:absolute">
      <Lottie
        className="img-shadow"
        lottieRef={assistantRef}
        animationData={animationData}
      />
    </div>
  );
};

export default LottieComponent;
