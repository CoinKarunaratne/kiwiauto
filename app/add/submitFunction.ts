import { db } from "@/config/firebase";
import {
  addDoc,
  doc,
  updateDoc,
  arrayUnion,
  collection,
  Timestamp,
} from "firebase/firestore";
import { ModifiedSales } from "../sales/page";

const salesRef = collection(db, "Sales");

type submitSales = {
  createdAt: Timestamp;
  businessID: string;
  customerID: string;
  customer: string;
  service: string;
  price: string;
  status: string;
};

export const submitSale = async (
  data: submitSales,
  id: string,
  customer: string
) => {
  await addDoc(salesRef, {
    ...data,
  });
  const serviceDoc = doc(db, "Services", id);
  await updateDoc(serviceDoc, { customers: arrayUnion(customer) });
};
