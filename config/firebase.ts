import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBn4V5Br_5KZf9-sHy00eFl1GGCEeH4EaQ",
  authDomain: "kiwi-auto-care.firebaseapp.com",
  projectId: "kiwi-auto-care",
  storageBucket: "kiwi-auto-care.appspot.com",
  messagingSenderId: "193771266541",
  appId: "1:193771266541:web:847834707d6ef47ab6c7e4",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
