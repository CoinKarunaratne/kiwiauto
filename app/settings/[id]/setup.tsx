"use client";

import React from "react";
import { SidebarNav } from "../../components/ui/sidebar-nav";
import { useEffect, useState } from "react";
import { Business } from "../../components/business-switcher";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "@/config/firebase";
import { useToast } from "@/app/components/ui/use-toast";

const Setup = ({}) => {
  const [businesses, setBusinesses] = useState<
    { title: string; href: string }[] | undefined
  >([]);

  const businessRef = collection(db, "Businesses");
  const { toast } = useToast();
  const getBusinessList = async () => {
    try {
      const data = await getDocs(query(businessRef, orderBy("createdAt")));
      const filteredData = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      })) as Business[];
      setBusinesses(() =>
        filteredData.map((doc) => ({
          title: doc.title,
          href: `/settings/${doc.id}`,
        }))
      );
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: JSON.stringify(error),
      });
    }
  };

  useEffect(() => {
    getBusinessList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <aside className="-mx-4 lg:w-1/5">
      <SidebarNav items={businesses} />
    </aside>
  );
};

export default Setup;
