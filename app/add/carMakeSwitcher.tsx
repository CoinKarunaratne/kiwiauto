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

import { useToast } from "@/app/components/ui/use-toast";

import axios from "axios";

type PopoverTriggerProps = React.ComponentPropsWithoutRef<
  typeof PopoverTrigger
>;

type ChangeChildState = React.Dispatch<React.SetStateAction<boolean>>;

interface serviceSwitcherProps extends PopoverTriggerProps {
  setCarMake: (make: string) => void;
  isSelected: boolean;
  setSelected: ChangeChildState;
}

const CarMakeSwitcher = ({
  className,
  setCarMake,
  isSelected,
  setSelected,
}: serviceSwitcherProps) => {
  const [open, setOpen] = React.useState<boolean>(false);
  const [carMakes, setCarMakes] = React.useState<string[]>([]);
  const [selectedCarMake, setSelectedCarMake] = React.useState<number>();

  const { toast } = useToast();

  const carMake = async () => {
    const options = {
      method: "GET",
      url: "https://car-data.p.rapidapi.com/cars/makes",
      headers: {
        "X-RapidAPI-Key": "86109d6b47mshd2578d17b9980b2p132e04jsnbcbbb86453ad",
        "X-RapidAPI-Host": "car-data.p.rapidapi.com",
      },
    };

    try {
      const response = await axios.request(options);
      (await !response.data.includes("Renault")) &&
        response.data.push("Renault");
      await setCarMakes(response.data);
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
      setSelectedCarMake(undefined);
    }
  }, [isSelected]);

  React.useEffect(() => {
    carMake();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
            ? selectedCarMake !== undefined && carMakes[selectedCarMake]
            : "Please select a brand"}
          <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className={cn("p-0", className)}>
        <Command>
          <CommandList>
            <CommandInput placeholder="Search car brands..." />
            <CommandEmpty>No service found.</CommandEmpty>
            <CommandGroup heading="Global car brands">
              {carMakes?.map((make, index) => (
                <CommandItem
                  key={index}
                  onSelect={() => {
                    setSelected(true);
                    setOpen(false);
                    setSelectedCarMake(index);
                    setCarMake(make);
                  }}
                  className="text-sm"
                >
                  {make}
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      selectedCarMake === index ? "opacity-100" : "opacity-0"
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

export default CarMakeSwitcher;
