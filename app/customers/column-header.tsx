import { Column } from "@tanstack/react-table";
import { ChevronsUpDown, EyeOff, SortAsc, SortDesc } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/app/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu";

interface DataTableColumnHeaderProps<TData, TValue>
  extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>;
  title: string;
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return <div className={cn(className)}>{title}</div>;
  }

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="-ml-3 h-8 data-[state=open]:bg-accent"
          >
            <span>{title}</span>
            {column.getIsSorted() === "desc" ? (
              <SortDesc className="ml-2 h-4 w-4" />
            ) : column.getIsSorted() === "asc" ? (
              <SortAsc className="ml-2 h-4 w-4" />
            ) : (
              <ChevronsUpDown className="ml-2 h-4 w-4" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem onClick={() => column.setFilterValue("SUV")}>
            SUV
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => column.setFilterValue("Pickup Truck")}
          >
            Pickup Truck
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => column.setFilterValue("Hatchback")}>
            Hatchback
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => column.setFilterValue("Station Wagon")}
          >
            Station Wagon
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => column.setFilterValue("Sedan")}>
            Sedan
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => column.setFilterValue("Mini Van")}>
            Mini Van
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => column.setFilterValue("")}>
            Clear filter
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
