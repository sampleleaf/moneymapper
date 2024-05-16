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
        const docRef = doc(db, "users", data.id, `${years}`, `${months}`);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const allItemsOfDay: Item[] = docSnap.data()[day];
          const itemFilter = allItemsOfDay.filter(
            (allItems) => allItems.item === popItem &&
              ((!isPositive && allItems.price < 0) || (isPositive && allItems.price > 0)) //(pay || income)
          );
          setItems(itemFilter);
        }
      })();
    }
  }, []);

  return items;
};

export default useDetailNoteData;
