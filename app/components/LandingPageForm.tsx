"use client";

import React from "react";
import { ChangeEvent, FC, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/config/firebase";
import { useRouter } from "next/navigation";
import { useToast } from "@/app/components/ui/use-toast";
import { sendPasswordResetEmail } from "firebase/auth";
import ResetPasswordComponent from "./ResetPasswordComponent";
import axios from "axios";

interface LandingPageFormProps {}

const LandingPageForm: FC<LandingPageFormProps> = ({}) => {
  const [input, setInput] = useState("");
  const [error, setError] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const passcode = e.target.value;
    setInput(passcode);
  };

  const resetPassword = async () => {
    try {
      await sendPasswordResetEmail(auth, "coinkarunaratne@gmail.com");

      toast({
        description: "Please check your admin email.",
      });
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: { err },
      });
    }
  };

  const login = async (
    event: React.MouseEvent<HTMLFormElement, MouseEvent>
  ) => {
    try {
      event.preventDefault();
      setIsLoading(true);
      await signInWithEmailAndPassword(
        auth,
        "coinkarunaratne@gmail.com",
        input
      );

      await axios
        .post("/api/auth/addJWT")
        .then((response) => console.log(response))
        .catch((error) => setError(`JWT Error : ${error}`));

      router.push("/dashboard");
    } catch (err) {
      setIsLoading(false);
      setError(`Signing error : ${err}`);
    }
  };
  return (
    <div className="flex flex-col gap-4 w-full max-w-sm">
      <form
        onSubmit={login}
        className="flex w-full max-w-sm items-center space-x-2"
      >
        <Input
          type="password"
          value={input}
          onChange={handleChange}
          placeholder="Enter passcode"
        />
        <Button type="submit" isLoading={isLoading}>
          Proceed
        </Button>
      </form>
      {error && <p className="text-sm text-red-500">{error}</p>}

      <ResetPasswordComponent resetPassword={resetPassword} />
    </div>
  );
};

export default LandingPageForm;
