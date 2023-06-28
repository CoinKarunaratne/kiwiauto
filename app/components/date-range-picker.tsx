"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { toast } from "@/app/components/ui/use-toast";

export function CalendarDateRangePicker({
  className,
  dateRangeData,
}: React.HTMLAttributes<HTMLDivElement> & {
  dateRangeData: (range: DateRange | undefined) => void;
}) {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  });
  const [isClear, setClear] = React.useState<boolean>(false);

  return (
    <div className={cn("flex gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            size="sm"
            className={cn(
              "w-[240px] justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
      <Button
        className="sm:mr-auto w-[100px] font-normal"
        size="sm"
        onClick={() => {
          if (date?.from) {
            if (isClear) {
              setDate({ from: undefined, to: undefined });
              setClear(false);
            } else {
              setClear(true);
              dateRangeData(date);
            }
          } else {
            toast({
              variant: "destructive",
              title: "Please pick a date.",
            });
          }
        }}
      >
        {isClear ? "Clear" : "Filter"}
      </Button>
    </div>
  );
}
