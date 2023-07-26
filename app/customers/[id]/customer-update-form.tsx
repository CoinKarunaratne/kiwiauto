import React from "react";
import { ModifiedCustomers } from "./page";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";

type updateCustomerProps = {
  updateCustomer: ModifiedCustomers;
  setUpdateCustomer: React.Dispatch<React.SetStateAction<ModifiedCustomers>>;
};

const UpdateCustomer = ({
  updateCustomer,
  setUpdateCustomer,
}: updateCustomerProps) => {
  return (
    <div className="space-y-3 mt-5">
      <div className="space-y-1">
        <Label>Name</Label>
        <Input
          onChange={(e) => {
            setUpdateCustomer((doc) => ({
              ...doc,
              name: e.target.value,
            }));
          }}
          value={updateCustomer.name}
        />
      </div>
      <div className="space-y-2">
        <Label>Contact</Label>
        <Input
          onChange={(e) => {
            setUpdateCustomer((doc) => ({
              ...doc,
              contact: e.target.value,
            }));
          }}
          value={updateCustomer.contact}
        />
      </div>
      <div className="space-y-2">
        <Label>Email</Label>
        <Input
          onChange={(e) => {
            setUpdateCustomer((doc) => ({
              ...doc,
              email: e.target.value,
            }));
          }}
          value={updateCustomer.email}
        />
      </div>
      <div className="space-y-2">
        <Label>Address</Label>
        <Input
          onChange={(e) => {
            setUpdateCustomer((doc) => ({
              ...doc,
              address: e.target.value,
            }));
          }}
          value={updateCustomer.address}
        />
      </div>
    </div>
  );
};

export default UpdateCustomer;
