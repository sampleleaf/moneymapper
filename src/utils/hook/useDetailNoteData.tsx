import { useEffect, useState } from "react";
import { db } from "@/utils/firebase";
import { doc, getDoc } from "firebase/firestore";

interface Item {
  id: string;
  item: string;
  note: string;
  price: number;
  location: string;
}

const useDetailNoteData = (
  years: number,
  months: number,
  day: string,
  popItem: string,
  isPositive: boolean
) => {
  const [items, setItems] = useState<Item[]>();

  useEffect(() => {
    const response = localStorage.getItem("loginData");
    if (response !== null && popItem) {
      const data = JSON.parse(response);
      (async () => {
        const yearString = years.toString();
        const monthString = months.toString();
        const docRef = doc(db, "users", data.id, yearString, monthString);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          //   console.log("Document data:", docSnap.data());
          const allItemsOfDay: Item[] = docSnap.data()[day];
          const itemFilter = allItemsOfDay.filter(
            (allItems) =>
              allItems.item === popItem &&
              ((!isPositive && allItems.price < 0) ||
                (isPositive && allItems.price > 0))
          );
          //   console.log(itemFilter);
          setItems(itemFilter);
        } else {
          // docSnap.data() will be undefined in this case
          console.log("No such document!");
        }
      })();
    }
  }, []);

  return items;
};

export default useDetailNoteData;
