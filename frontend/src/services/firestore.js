import { getFirestore, collection, addDoc, getDocs } from "firebase/firestore";
import app from "../firebase";

const db = getFirestore(app);

export const addUser = (data) => {
  return addDoc(collection(db, "users"), data);
};

export const getUsers = () => {
  return getDocs(collection(db, "users"));
};