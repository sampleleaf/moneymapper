import { useEffect, useState } from "react";
import { getFireStore } from "../reviseFireStore";

const useDetailGroupData = (
  years: number,
  months: number,
  isPositive: boolean
) => {
  const [googleData, setGoogleData] = useState<(string | number)[][]>([]);
  const [days, setDays] = useState<string[]>([]);
  const [reverseDays, setReverseDays] = useState<string[]>([]);

  useEffect(() => {
    const response = localStorage.getItem("loginData");
    if (response !== null) {
      const data = JSON.parse(response);
      (async () => {
        const itemsOfMonth = await getFireStore("users", data.id, years, months);
        //days of array
        const daysOfMonth = Object.keys(itemsOfMonth);
        const reverseDaysOfMonth = [...daysOfMonth].reverse();
        setDays(daysOfMonth);
        setReverseDays(reverseDaysOfMonth);
        //know item and totalPrice, after ensure income or pay Item, 
        const dayLength = Object.keys(itemsOfMonth).length;
        const allItems = [];
        for (let i = 0; i < dayLength; i++) {
          const dayOfMonth: string = daysOfMonth[i];
          allItems.push(...itemsOfMonth[dayOfMonth]);
        }
        const totalPriceOfItems: { [key: string]: number } = {};
        allItems.forEach((item) => {
          const itemName = item.item;
          const price = item.price;
          if ((!isPositive && price < 0) || (isPositive && price > 0)) {
            //(pay || income)
            if (itemName in totalPriceOfItems) {
              totalPriceOfItems[itemName] += Math.abs(price);
            } else {
              totalPriceOfItems[itemName] = Math.abs(price);
            }
          }
        });
        //refactor for google charts
        const itemLength = Object.keys(totalPriceOfItems).length;
        const categoriesOfItem = Object.keys(totalPriceOfItems);
        const googleChartArray = [];
        for (let i = 0; i < itemLength; i++) {
          const categoryOfItem = categoriesOfItem[i];
          googleChartArray.push([
            categoryOfItem,
            totalPriceOfItems[categoryOfItem],
          ]);
        }
        setGoogleData(googleChartArray);
      })();
    }
  }, [years, months, isPositive]);

  return { googleData, days, reverseDays };
};

export default useDetailGroupData;
