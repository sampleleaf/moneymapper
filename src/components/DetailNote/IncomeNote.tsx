import { useEffect, useState } from "react";
import { db } from "@/utils/firebase";
import { doc, getDoc } from "firebase/firestore";
import detailNote from "@/css/DetailNote.module.css";

interface Item {
  id: string;
  item: string;
  note: string;
  price: number;
  location: string;
}

const IncomeNote: React.FC<{
  popItem: string | number;
  total: string | number;
  day: string;
  months: number;
  years: number;
}> = ({ popItem, total, day, months, years }) => {
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
            (allItems) => allItems.item === popItem && allItems.price > 0
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

  const totalPriceOfItems =
    items &&
    items.reduce((acc, cur) => {
      return acc + cur.price;
    }, 0);

  const chineseDays = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];

  return (
    <>
      <div className={detailNote.container}>
        {items && items?.length > 0 && (
          <div className={detailNote.dayRemainder}>
            <p>
              {years}/{months}/{day} {`${chineseDays[new Date(`${years}-${months}-${day}`).getDay()]}`}
            </p>
            <p>${Math.abs(totalPriceOfItems as number)}</p>
          </div>
        )}
        <div className={detailNote.dayItems}>
          {items &&
            items.map((item) => (
              <div key={item.id} className={detailNote.itemGroup}>
                <div className={detailNote.percentGroup}>
                  <div className={detailNote.percent}>
                    <p>{item.note || item.item}</p>
                    <p style={{color: "rgb(158,225,255)"}}>{Math.abs(item.price / (total as number) * 100).toFixed(2)}%</p>
                  </div>
                  <div className={detailNote.percentBarContainer}>
                    <div className={detailNote.percentBar}></div>
                    <div className={detailNote.displayPercent} style={{width: `${Math.abs(item.price / (total as number) * 100).toFixed(2)}%`, backgroundColor: "rgb(158,225,255)"}}></div>
                  </div>
                </div>
                <p>${Math.abs(item.price)}</p>
              </div>
            ))}
        </div>
      </div>
    </>
  );
};

export default IncomeNote;
