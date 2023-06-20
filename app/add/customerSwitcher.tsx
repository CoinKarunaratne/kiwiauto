"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/app/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/app/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/app/components/ui/popover";
import { db } from "@/config/firebase";
import {
  collection,
  getDocs,
  orderBy,
  query,
  Timestamp,
} from "firebase/firestore";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/app/components/ui/use-toast";
import { useSelector } from "react-redux";

type PopoverTriggerProps = React.ComponentPropsWithoutRef<
  typeof PopoverTrigger
>;

type ChangeChildState = React.Dispatch<React.SetStateAction<boolean>>;

interface customerSwitcherProps extends PopoverTriggerProps {
  setCustomer: (data: string, id: string) => void;
  isSelected: boolean;
  setSelected: ChangeChildState;
}

type RootState = {
  businessID: string;
  businessName: string;
};
interface Customer {
  name: string;
  id: string;
  address: string;
  contact: string;
  createdAt: Timestamp;
  email: string;
  type: string;
  vehicle: string;
}

const CustomerSwitcher = ({
  className,
  setCustomer,
  isSelected,
  setSelected,
}: customerSwitcherProps) => {
  const [open, setOpen] = React.useState<boolean>(false);
  const [customers, setCustomers] = React.useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = React.useState<number>();

  const [customersLoading, setCustomersLoading] =
    React.useState<boolean>(false);
  const { toast } = useToast();

  const customersRef = collection(db, "Customers");
  const getCustomersList = async () => {
    try {
      const data = await getDocs(query(customersRef, orderBy("createdAt")));
      const filteredData = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      })) as Customer[];
      return filteredData;
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: JSON.stringify(error),
      });
    }
  };

  const customersQuery = useQuery({
    queryKey: ["customers"],
    queryFn: getCustomersList,
  });

  React.useEffect(() => {
    if (customersQuery.isLoading) {
      setCustomersLoading(true);
    }

    if (customersQuery.isError) {
      setCustomersLoading(true);
    }

    if (customersQuery.isSuccess) {
      setCustomersLoading(false);
      setCustomers(customersQuery.data || []);
    }
    if (isSelected === false) {
      setSelectedCustomer(undefined);
    }
  }, [customersQuery, isSelected]);

  const businessName = useSelector((state: RootState) => state.businessName);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          role="combobox"
          aria-expanded={open}
          aria-label="Select a team"
          className={cn("justify-between", className)}
        >
          {isSelected
            ? selectedCustomer !== undefined &&
              customers[selectedCustomer]?.name
            : "Please select a customer"}
          <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className={cn("p-0", className)}>
        <Command>
          <CommandList>
            <CommandInput placeholder="Search customers..." />
            <CommandEmpty>No customer found.</CommandEmpty>
            <CommandGroup heading={`${businessName} Customers`}>
              {customersLoading ? (
                <CommandItem className="text-sm">Loading...</CommandItem>
              ) : (
                customers?.map((person, index) => (
                  <CommandItem
                    key={index}
                    onSelect={() => {
                      setSelected(true);
                      setOpen(false);
                      setSelectedCustomer(index);
                      setCustomer(person?.name, person?.id);
                    }}
                    className="text-sm"
                  >
                    {person?.name}
                    <Check
                      className={cn(
                        "ml-auto h-4 w-4",
                        selectedCustomer === index ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))
              )}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default CustomerSwitcher;
