import { db } from "@/config/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { CustomerFormValues } from "./customerForm";

const customerRef = collection(db, "Customers");

export const submitCustomer = async (data: CustomerFormValues) => {
  await addDoc(customerRef, {
    ...data,
    createdAt: serverTimestamp(),
  });
};
