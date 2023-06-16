import { FC } from "react";
import { Separator } from "../../components/ui/separator";
import { ServiceForm } from "./serviceForm";

const page: FC = ({}) => {
  return (
    <div className="space-y-3">
      <div>
        <h3 className="text-lg font-medium">New Service</h3>
      </div>
      <Separator />
      <ServiceForm />
    </div>
  );
};

export default page;
