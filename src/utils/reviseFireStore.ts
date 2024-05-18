import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  deleteDoc,
  FieldValue,
} from "firebase/firestore";
import { db } from "./firebase";
import { Value } from "@/interfaces";

export const setFireStore = async (
  collection: string,
  documentId: string,
  data: { [day: number]: FieldValue },
  date: Value
) => {
  try {
    const year = (date as Date).getFullYear().toString();
    const month = ((date as Date).getMonth() + 1).toString();
    const docRef = doc(db, collection, documentId, year, month);
    await setDoc(docRef, data, { merge: true });
  } catch (e) {
    // console.error("Error adding document: ", e);
  }
};

export const getFireStore = async (
  collection: string,
  documentId: string,
  years: number,
  months: number
) => {
  const docRef = doc(db, collection, documentId, `${years}`, `${months}`);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return docSnap.data();
  } else {
    // docSnap.data() will be undefined in this case
    return {};
  }
};

export const updateFireStore = async (
  collection: string,
  documentId: string,
  years: number,
  months: number,
  data: { [day: number]: FieldValue },
) => {
  try {
    const docRef = doc(db, collection, documentId, `${years}`, `${months}`);
    await updateDoc(docRef, data);
  } catch (error) {
    console.error("updateFireStore", error);
    throw error;
  }
};
