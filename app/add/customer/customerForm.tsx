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
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Separator } from "@/app/components/ui/separator";

const customerFormSchema = z.object({
  name: z.string().min(1, {
    message: "Please enter customer name.",
  }),
  contact: z.string().min(1, {
    message: "Please enter customer's contact",
  }),
  email: z.string().optional(),
  address: z.string().optional(),
  type: z.string().optional(),
  vehicle: z.string().optional(),
});

export type CustomerFormValues = z.infer<typeof customerFormSchema>;
type RootState = {
  businessID: string;
  businessName: string;
};

export function SaleForm() {
  const form = useForm<CustomerFormValues>({
    resolver: zodResolver(customerFormSchema),
    mode: "onChange",
  });

  const [loading, isLoading] = useState<boolean>(false);
  const businessID = useSelector((state: RootState) => state.businessID);
  const businessName = useSelector((state: RootState) => state.businessName);

  const formReset = () => {
    form.setValue("name", ""); // Set initial value for "name" field
    form.setValue("contact", ""); // Set initial value for "contact" field
    form.setValue("email", ""); // Set initial value for "email" field
    form.setValue("address", ""); // Set initial value for "address" field
    form.setValue("vehicle", ""); // Set initial value for "vehicle" field
    form.setValue("type", ""); // Set initial value for "type" field
  };

  useEffect(() => {
    formReset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function onSubmit(data: CustomerFormValues) {
    isLoading(true);
    const updatedData = { ...data, businessID };
    submitCustomer(updatedData)
      .then(() => {
        isLoading(false);
        formReset();
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
        formReset();
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: JSON.stringify(error),
        });
      });
  }

  return (
    <>
      <div>
        <h3 className="text-sm sm:text-lg font-medium">
          {" "}
          New Customer for <span className="font-bold">{businessName}</span>
        </h3>
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-5 pt-10"
        >
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
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
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
    </>
  );
}
