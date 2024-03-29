import { Input } from "@/app/components/ui/input";

export function Search() {
  return (
    <div>
      <Input
        type="search"
        placeholder="Search a customer..."
        className="h-9 md:w-[300px]"
      />
    </div>
  );
}
