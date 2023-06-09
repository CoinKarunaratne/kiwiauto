"use client";

import * as React from "react";
import { Check, ChevronsUpDown, PlusCircle } from "lucide-react";

import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "./ui/command";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { db } from "@/config/firebase";
import { storage } from "@/config/firebase";
import {
  addDoc,
  collection,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import {
  getDownloadURL,
  ref as storageRef,
  uploadBytes,
} from "firebase/storage";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/app/components/ui/use-toast";
import { useDispatch, useSelector } from "react-redux";
import { setBusiness } from "@/lib/state";

type PopoverTriggerProps = React.ComponentPropsWithoutRef<
  typeof PopoverTrigger
>;

interface TeamSwitcherProps extends PopoverTriggerProps {}
type RootState = {
  businessID: string;
};
export interface Business {
  createdAt: Timestamp;
  title: string;
  id: string;
  logo?: string;
}

export default function TeamSwitcher({ className }: TeamSwitcherProps) {
  const [open, setOpen] = React.useState(false);
  const [showNewTeamDialog, setShowNewTeamDialog] = React.useState(false);
  const [businesses, setBusinesses] = React.useState<Business[]>([]);
  const [newBusiness, setNewBusiness] = React.useState<string>();
  const [isLoading, setLoading] = React.useState<boolean>(false);
  const [fileUpload, setFileUpload] = React.useState<File | null>(null);
  const [error, setError] = React.useState<string>("");
  const [businessesLoading, setBusinessesLoading] =
    React.useState<boolean>(false);
  const { toast } = useToast();
  const dispatch = useDispatch();

  const businessRef = collection(db, "Businesses");
  const getBusinessList = async () => {
    try {
      const data = await getDocs(query(businessRef, orderBy("createdAt")));
      const filteredData = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      })) as Business[];
      return filteredData;
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: JSON.stringify(error),
      });
    }
  };

  const queryClient = useQueryClient();
  const businessesQuery = useQuery({
    queryKey: ["businesses"],
    queryFn: getBusinessList,
  });

  React.useEffect(() => {
    if (businessesQuery.isLoading) {
      setBusinessesLoading(true);
    }

    if (businessesQuery.isError) {
      setBusinessesLoading(true);
    }

    if (businessesQuery.isSuccess) {
      setBusinessesLoading(false);
      setBusinesses(businessesQuery.data || []);
    }
  }, [businessesQuery]);

  const businessID = useSelector((state: RootState) => state.businessID);
  const selectedBusiness = businesses.find(
    (business) => business.id === businessID
  );

  const submitBusiness = async () => {
    try {
      setLoading(true);
      if (!newBusiness) {
        setError("Please add a valid business name");
        setLoading(false);
        return Promise.reject("Please add a valid business name");
      }
      if (fileUpload) {
        await uploadFile();
        const url = await getDownloadURL(
          storageRef(storage, `businesses/${fileUpload?.name}`)
        );
        await addDoc(businessRef, {
          title: newBusiness,
          logo: url,
          createdAt: serverTimestamp(),
        });
        setError("");
        setShowNewTeamDialog(false);
        setLoading(false);
        setNewBusiness("");
        setFileUpload(null);
        return;
      }
      await addDoc(businessRef, {
        title: newBusiness,
        createdAt: serverTimestamp(),
      });
      setError("");
      setShowNewTeamDialog(false);
      setLoading(false);
      setNewBusiness("");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: JSON.stringify(error),
      });
    }
  };

  const uploadFile = async () => {
    const filesFolderRef = storageRef(
      storage,
      `businesses/${fileUpload?.name}`
    );
    try {
      if (fileUpload) {
        await uploadBytes(filesFolderRef, fileUpload);
      }
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: JSON.stringify(err),
      });
    }
  };

  const newBusinessMuatation = useMutation({
    mutationFn: () => {
      return submitBusiness();
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries(["businesses"]);
      await queryClient.refetchQueries(["businesses"]); // Wait for the query to refetch
      const updatedBusinesses = queryClient.getQueryData<Business[]>([
        "businesses",
      ]);
      const latestBusiness = updatedBusinesses?.[updatedBusinesses.length - 1];
      await dispatch(
        setBusiness({
          businessID: latestBusiness?.id,
          businessName: latestBusiness?.title,
        })
      );

      toast({
        title: "Success!",
        description: "Successfully added your new business",
      });
    },
  });

  return (
    <Dialog open={showNewTeamDialog} onOpenChange={setShowNewTeamDialog}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            role="combobox"
            aria-expanded={open}
            aria-label="Select a team"
            className={cn("w-[200px] justify-between", className)}
          >
            <Avatar className="mr-2 h-5 w-5">
              <AvatarImage
                src={selectedBusiness?.logo}
                alt={selectedBusiness?.title}
              />
              <AvatarFallback>$</AvatarFallback>
            </Avatar>
            {businessesLoading ? "Loading..." : selectedBusiness?.title}
            <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandList>
              <CommandInput placeholder="Search business..." />
              <CommandEmpty>No team found.</CommandEmpty>
              <CommandGroup heading={"Current Businesses"}>
                {businesses?.map((group, index) => (
                  <CommandItem
                    key={index}
                    onSelect={() => {
                      dispatch(
                        setBusiness({
                          businessID: group.id,
                          businessName: group.title,
                        })
                      );
                      setOpen(false);
                    }}
                    className="text-sm"
                  >
                    <Avatar className="mr-2 h-5 w-5">
                      <AvatarImage src={group?.logo} alt={group?.title} />
                      <AvatarFallback>$</AvatarFallback>
                    </Avatar>
                    {group?.title}
                    <Check
                      className={cn(
                        "ml-auto h-4 w-4",
                        businessID === group.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
            <CommandSeparator />
            <CommandList>
              <CommandGroup>
                <DialogTrigger asChild>
                  <CommandItem
                    onSelect={() => {
                      setOpen(false);
                      setShowNewTeamDialog(true);
                    }}
                  >
                    <PlusCircle className="mr-2 h-5 w-5" />
                    Create Business
                  </CommandItem>
                </DialogTrigger>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Business</DialogTitle>
          <DialogDescription>
            Add a new business to manage services and customers.
          </DialogDescription>
        </DialogHeader>
        <div>
          <div className="space-y-4 py-2 pb-4">
            <div className="space-y-2">
              <Label htmlFor="name">Business name</Label>
              <Input
                id="name"
                placeholder="Car Grooming."
                autoComplete="off"
                value={newBusiness}
                onChange={(e) => {
                  setError("");
                  setNewBusiness(e.target.value);
                }}
              />
              <p className="text-sm text-red-500"> {error}</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Business Logo</Label>
              <Input
                id="logo"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const files = e.target.files;
                  if (files && files.length > 0) {
                    setFileUpload(files[0]);
                  }
                }}
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setShowNewTeamDialog(false)}>
            Cancel
          </Button>
          <Button
            isLoading={isLoading}
            type="submit"
            onClick={() => newBusinessMuatation.mutate()}
          >
            Continue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
