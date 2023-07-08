"use client";

import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Separator } from "@/app/components/ui/separator";
import { useToast } from "@/app/components/ui/use-toast";
import React, { useEffect } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import {
  getDownloadURL,
  ref as storageRef,
  uploadBytes,
} from "firebase/storage";
import { storage } from "@/config/firebase";
import { db } from "@/config/firebase";

import { Business } from "@/app/components/business-switcher";
import { useRouter } from "next/navigation";

type Props = {
  slug: string;
};

const BusinessForm = ({ slug }: Props) => {
  const router = useRouter();

  const [fileUpload, setFileUpload] = React.useState<File | null>(null);
  const [error, setError] = React.useState<string>("");
  const [heading, setHeading] = React.useState<string>("");
  const [isLoading, setLoading] = React.useState<boolean>(false);
  const [business, setBusiness] = React.useState<{
    businessName: string;
    businessID: string;
  }>({ businessName: "", businessID: "" });
  const { toast } = useToast();

  useEffect(() => {
    async function getBusiness() {
      const businessDoc = doc(db, "Businesses", slug);
      const docSnap = await getDoc(businessDoc);
      const businessSnap = {
        ...(docSnap.data() as Business),
        id: docSnap.id,
      };
      setHeading(businessSnap.title);
      setBusiness(() => ({
        businessID: businessSnap.id,
        businessName: businessSnap.title,
      }));
    }
    getBusiness();
  }, [slug]);

  const submitBusiness = async () => {
    try {
      setLoading(true);
      const businessDoc = doc(db, "Businesses", business.businessID);
      if (!business.businessName || business.businessName === "") {
        setError("Please add a valid business name");
        setLoading(false);
        return Promise.reject("Please add a valid business name");
      }
      if (fileUpload) {
        await uploadFile();
        const url = await getDownloadURL(
          storageRef(storage, `businesses/${fileUpload?.name}`)
        );

        await updateDoc(businessDoc, {
          title: business.businessName,
          logo: url,
        });
        setError("");
        setLoading(false);
        setFileUpload(null);
        toast({
          title: "Success!",
        });
        router.push("/dashboard");
        return;
      }
      await updateDoc(businessDoc, {
        title: business.businessName,
      });
      setError("");
      setLoading(false);
      toast({
        title: "Success!",
      });
      router.push("/dashboard");
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
  return (
    <>
      <div>
        <h3 className="text-sm sm:text-lg font-medium mt-5">
          {" "}
          Edit details of <span className="font-bold">{heading}</span>
        </h3>
      </div>
      <Separator />
      <div>
        <div className="space-y-6 py-2 pb-4 mt-7">
          <div className="space-y-2">
            <Label htmlFor="name">Business name</Label>
            <Input
              id="name"
              autoComplete="off"
              value={business.businessName}
              onChange={(e) => {
                setError("");
                setBusiness((doc) => ({
                  ...doc,
                  businessName: e.target.value,
                }));
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
        <div className="mt-5">
          <Button
            isLoading={isLoading}
            type="submit"
            onClick={() => submitBusiness()}
          >
            Continue
          </Button>
        </div>
      </div>
    </>
  );
};

export default BusinessForm;
