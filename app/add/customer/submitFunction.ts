import { db } from "@/config/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { SaleFormValues } from "./saleForm";

const customerRef = collection(db, "Customers");

export const submitCustomer = async (data: SaleFormValues) => {
  try {
    await addDoc(customerRef, {
      ...data,
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    console.log(error);
  }
};
