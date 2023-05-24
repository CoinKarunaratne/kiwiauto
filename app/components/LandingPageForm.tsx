"use client";

import { ChangeEvent, FC, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import Link from "next/link";

interface LandingPageFormProps {}

const LandingPageForm: FC<LandingPageFormProps> = ({}) => {
  const [input, setInput] = useState("");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const passcode = e.target.value;
    setInput(passcode);
  };
  return (
    <div className="flex flex-col gap-4 w-full max-w-sm">
      <form className="flex w-full max-w-sm items-center space-x-2">
        <Input
          type="text"
          value={input}
          onChange={handleChange}
          placeholder="Enter passcode"
        />
        <Button>Proceed</Button>
      </form>
      <Link href="/login" className="text-sm underline text-blue-400">
        Forgot Password?
      </Link>
    </div>
  );
};

export default LandingPageForm;
