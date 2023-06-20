import { db } from "@/config/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { SaleFormValues } from "./customerForm";

const customerRef = collection(db, "Customers");

export const submitCustomer = async (data: SaleFormValues) => {
  await addDoc(customerRef, {
    ...data,
    createdAt: serverTimestamp(),
  });
};
