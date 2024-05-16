import { useEffect, useState } from "react";
import { db } from "@/utils/firebase";
import { doc, getDoc } from "firebase/firestore";

const useDetailGroupData = (years: number, months: number, isPositive: boolean) => {
    const [googleData, setGoogleData] = useState<(string | number)[][]>([]);
    const [days, setDays] = useState<string[]>([]);
    const [reverseDays, setReverseDays] = useState<string[]>([]);

    useEffect(() => {
        const response = localStorage.getItem("loginData");
        if (response !== null) {
          const data = JSON.parse(response);
          (async () => {
            const docRef = doc(db, "users", data.id, `${years}`, `${months}`);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
              //days of array
              const reversedArray = [...Object.keys(docSnap.data())].reverse();
              setDays(Object.keys(docSnap.data()));
              setReverseDays(reversedArray)
              //item category
              const dayLength = Object.keys(docSnap.data()).length;
              const items = [];
              for (let i = 0; i < dayLength; i++) {
                items.push(...docSnap.data()[Object.keys(docSnap.data())[i]]);
              }
              const itemTotals: { [key: string]: number } = {};
              items.forEach((item) => {
                const itemName = item.item;
                const price = item.price;
                if ((!isPositive && price < 0) || (isPositive && price > 0)) { //(pay || income)
                  if (itemName in itemTotals) {
                    itemTotals[itemName] += Math.abs(price);
                  } else {
                    itemTotals[itemName] = Math.abs(price);
                  }
                }
              });
              //refactor for google charts
              const itemLength = Object.keys(itemTotals).length;
              const googleChartArray = [];
              for (let i = 0; i < itemLength; i++) {
                googleChartArray.push([
                  Object.keys(itemTotals)[i],
                  itemTotals[Object.keys(itemTotals)[i]],
                ]);
              }
              setGoogleData(googleChartArray);
            } else {
              // if docSnap.data() not exists
              setGoogleData([]);
            }
          })();
        }
      }, [years, months, isPositive]);

    return { googleData, days, reverseDays }
}

export default useDetailGroupData