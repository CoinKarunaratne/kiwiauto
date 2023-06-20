import { db } from "@/config/firebase";
import {
  addDoc,
  doc,
  updateDoc,
  arrayUnion,
  collection,
  serverTimestamp,
} from "firebase/firestore";
import { SaleFormValues } from "./saleForm";

const salesRef = collection(db, "Sales");

export const submitSale = async (
  data: SaleFormValues,
  id: string,
  customer: string
) => {
  await addDoc(salesRef, {
    ...data,
    createdAt: serverTimestamp(),
  });
  const serviceDoc = doc(db, "Services", id);
  await updateDoc(serviceDoc, { customers: arrayUnion(customer) });
};
