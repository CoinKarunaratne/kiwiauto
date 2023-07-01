"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { toast } from "@/app/components/ui/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/app/components/react-hook-form/form";
import { submitService } from "./submitFunction";
import { useState } from "react";
import { Textarea } from "@/app/components/ui/textarea";
import { useSelector } from "react-redux";
import { Separator } from "@/app/components/ui/separator";

const serviceFormSchema = z.object({
  name: z.string().min(1, {
    message: "Please enter a name for your service.",
  }),
  fee: z.string().min(1, {
    message: "Please enter service fee.",
  }),
  description: z.string().optional(),
});

export type ServiceFormValues = z.infer<typeof serviceFormSchema>;
type RootState = {
  businessID: string;
  businessName: string;
};

export function ServiceForm() {
  const form = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceFormSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      fee: "",
      description: "",
    },
  });

  const [loading, isLoading] = useState<boolean>(false);
  const businessID = useSelector((state: RootState) => state.businessID);
  const businessName = useSelector((state: RootState) => state.businessName);

  function onSubmit(data: ServiceFormValues) {
    isLoading(true);
    const updatedData = { ...data, businessID, customers: [] };
    submitService(updatedData)
      .then(() => {
        isLoading(false);
        toast({
          title: "You submitted the following values:",
          description: (
            <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
              <code className="text-white">
                {JSON.stringify(data, null, 2)}
              </code>
            </pre>
          ),
        });
      })
      .catch((error) => {
        console.log(error);
        isLoading(false);
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: JSON.stringify(error),
        });
      });
    form.reset();
  }

  return (
    <>
      <div>
        <h3 className="text-sm sm:text-lg font-medium">
          {" "}
          New Sale for <span className="font-bold">{businessName}</span>
        </h3>
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 pt-10"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Service Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="fee"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fee</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormDescription>Enter the fee amount here.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea {...field} />
                </FormControl>
                <FormDescription>
                  Provide additional details or description about the new
                  service
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button isLoading={loading} type="submit">
            Submit
          </Button>
        </form>
      </Form>
    </>
  );
}
