"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/app/components/ui/popover";
import { format } from "date-fns";
import { toast } from "@/app/components/ui/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/app/components/react-hook-form/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { submitSale } from "./submitFunction";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import CustomerSwitcher from "./customerSwitcher";
import ServiceSwitcher from "./serviceSwitcher";
import { Calendar } from "../components/ui/calendar";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { Timestamp } from "firebase/firestore";
import { Separator } from "../components/ui/separator";

const saleFormSchema = z.object({
  createdAt: z.date({
    required_error: "A date of birth is required.",
  }),
  customer: z.string().min(1, {
    message: "Please enter customer name.",
  }),
  service: z.string().min(1, {
    message: "Please enter a service.",
  }),
  price: z.string().min(1, {
    message: "Please enter a valid price.",
  }),
  status: z.string().min(1, {
    message: "Please select the status.",
  }),
});

export type SaleFormValues = z.infer<typeof saleFormSchema>;
type RootState = {
  businessID: string;
  businessName: string;
};

export function SaleForm() {
  const form = useForm<SaleFormValues>({
    resolver: zodResolver(saleFormSchema),
    mode: "onChange",
  });

  const [loading, isLoading] = useState<boolean>(false);
  const [isCustomerSelected, setCustomerSelected] = useState<boolean>(false);
  const [isServiceSelected, setServiceSelected] = useState<boolean>(false);

  const [serviceID, setServiceID] = useState<string>("");
  const [customerID, setCustomerID] = useState<string>("");

  const businessID = useSelector((state: RootState) => state.businessID);
  const businessName = useSelector((state: RootState) => state.businessName);

  const formReset = () => {
    form.setValue("createdAt", new Date());
    form.setValue("customer", "");
    form.setValue("service", "");
    form.setValue("price", "");
  };

  useEffect(() => {
    formReset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setCustomer = (data: string, id: string) => {
    form.setValue("customer", data);
    setCustomerID(id);
  };

  const setService = (name: string, fee: string, id: string) => {
    form.setValue("service", name);
    form.setValue("price", fee);
    setServiceID(id);
  };

  function onSubmit(data: SaleFormValues) {
    isLoading(true);
    setServiceSelected(false);
    setCustomerSelected(false);
    const updatedData = {
      ...data,
      createdAt: Timestamp.fromDate(data.createdAt),
      businessID,
      customerID,
    };
    submitSale(updatedData, serviceID, customerID)
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
            name="createdAt"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Sale Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[240px] pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="customer"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Customer Name</FormLabel>
                <FormControl>
                  <div>
                    <CustomerSwitcher
                      {...field}
                      setCustomer={setCustomer}
                      isSelected={isCustomerSelected}
                      setSelected={setCustomerSelected}
                      className="w-[400px]"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="service"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Service</FormLabel>
                <FormControl>
                  <div>
                    <ServiceSwitcher
                      {...field}
                      setService={setService}
                      isSelected={isServiceSelected}
                      setSelected={setServiceSelected}
                      className="w-[400px]"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input {...field} className="w-[400px]" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-[400px]">
                      <SelectValue placeholder="Select the status of the sale" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
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
