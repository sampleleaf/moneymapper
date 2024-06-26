import { useEffect, useState } from "react";

import { Item } from "@/interfaces";
import { getFireStore } from "@/utils/reviseFireStore";

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
        const itemsOfMonth = await getFireStore("users", data.id, years, months);
        const allItemsOfDay: Item[] = itemsOfMonth[day];
        const itemFilter = allItemsOfDay.filter(
          (allItems) =>
            allItems.item === popItem &&
            ((!isPositive && allItems.price < 0) || //pay
              (isPositive && allItems.price > 0)) //income
        );
        setItems(itemFilter);
      })();
    }
  }, []);

  const totalPriceOfItems =
    items &&
    items.reduce((acc, cur) => {
      return acc + cur.price;
    }, 0);

  return {items, totalPriceOfItems};
};

export default useDetailNoteData;
