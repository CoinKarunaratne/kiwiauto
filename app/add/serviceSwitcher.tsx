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
  where,
} from "firebase/firestore";
import { useToast } from "@/app/components/ui/use-toast";
import { useSelector } from "react-redux";

type PopoverTriggerProps = React.ComponentPropsWithoutRef<
  typeof PopoverTrigger
>;

type ChangeChildState = React.Dispatch<React.SetStateAction<boolean>>;

interface serviceSwitcherProps extends PopoverTriggerProps {
  setService: (name: string, fee: string, id: string) => void;
  isSelected: boolean;
  setSelected: ChangeChildState;
}

type RootState = {
  businessID: string;
  businessName: string;
};
interface Service {
  name: string;
  id: string;
  businessID: string;
  createdAt: Timestamp;
  customers: string[];
  description: string;
  fee: string;
}

const ServiceSwitcher = ({
  className,
  setService,
  isSelected,
  setSelected,
}: serviceSwitcherProps) => {
  const [open, setOpen] = React.useState<boolean>(false);
  const [services, setServices] = React.useState<Service[]>([]);
  const [selectedService, setSelectedService] = React.useState<number>();
  const { toast } = useToast();

  const businessID = useSelector((state: RootState) => state.businessID);
  const businessName = useSelector((state: RootState) => state.businessName);

  const servicesRef = collection(db, "Services");

  const getServicesList = async () => {
    try {
      const data = await getDocs(
        query(
          servicesRef,
          where("businessID", "==", businessID),
          orderBy("createdAt")
        )
      );
      const filteredData = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      })) as Service[];
      return filteredData;
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: JSON.stringify(error),
      });
    }
  };

  React.useEffect(() => {
    if (isSelected === false) {
      setSelectedService(undefined);
    }
  }, [isSelected]);

  React.useEffect(() => {
    getServicesList()
      .then((servicesList) => {
        if (servicesList !== undefined) {
          setServices(servicesList);
        }
      })
      .catch((error) => {
        toast({
          variant: "destructive",
          title: `Error updating ${businessName} services.`,
          description: JSON.stringify(error),
        });
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [businessName]);

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
            ? selectedService !== undefined && services[selectedService]?.name
            : "Please select a service"}
          <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className={cn("p-0", className)}>
        <Command>
          <CommandList>
            <CommandInput placeholder="Search services..." />
            <CommandEmpty>No service found.</CommandEmpty>
            <CommandGroup heading={`${businessName} Services`}>
              {services?.map((service, index) => (
                <CommandItem
                  key={index}
                  onSelect={() => {
                    setSelected(true);
                    setOpen(false);
                    setSelectedService(index);
                    setService(service?.name, service?.fee, service?.id);
                  }}
                  className="text-sm"
                >
                  {service?.name}
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      selectedService === index ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default ServiceSwitcher;
