"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { toast } from "@/app/components/ui/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/app/components/react-hook-form/form";
import { submitCustomer } from "./submitFunction";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

const saleFormSchema = z.object({
  name: z.string(),
  contact: z.string(),
  email: z.string().email().optional().default("customer@email.com"),
  address: z.string().optional().default(""),
  type: z.string({
    required_error: "Please select a vehicle type",
  }),
  vehicle: z.string(),
});

export type SaleFormValues = z.infer<typeof saleFormSchema>;

export function SaleForm() {
  const form = useForm<SaleFormValues>({
    resolver: zodResolver(saleFormSchema),
    mode: "onChange",
  });

  const [loading, isLoading] = useState<boolean>(false);
  const queryClient = useQueryClient();
  const state = queryClient.getQueryState(["state"]);

  function onSubmit(data: SaleFormValues) {
    isLoading(true);
    const updatedData = { ...data, businessID: state?.data };
    submitCustomer(updatedData)
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
        isLoading(false);
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: JSON.stringify(error),
        });
      });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Customer Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="contact"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contact</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a vehicle Type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="SUV">SUV</SelectItem>
                  <SelectItem value="Sedan">Sedan</SelectItem>
                  <SelectItem value="Pickup Truck">Pickup Truck</SelectItem>
                  <SelectItem value="Hatchback">Hatchback</SelectItem>
                  <SelectItem value="Station Wagon">Station Wagon</SelectItem>
                  <SelectItem value="Mini Van">Mini Van</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="vehicle"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Vehicle</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button isLoading={loading} type="submit">
          Submit
        </Button>
      </form>
    </Form>
  );
}