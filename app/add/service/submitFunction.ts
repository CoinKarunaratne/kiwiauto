import { db } from "@/config/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { ServiceFormValues } from "./serviceForm";

const serviceRef = collection(db, "Services");

export const submitService = async (data: ServiceFormValues) => {
  await addDoc(serviceRef, {
    ...data,
    createdAt: serverTimestamp(),
  });
};
