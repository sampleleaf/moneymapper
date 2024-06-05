import { useEffect, useState } from "react";

import detailNote from "@/css/DetailNote.module.css";
import { Item } from "@/interfaces";
import { chineseDays } from "@/utils/constant";
import { getFireStore } from "@/utils/reviseFireStore";

const RemainderNote: React.FC<{
  date: string | number;
  years: number;
  months: number;
}> = ({ date, years, months }) => {
  const day = (date as string).slice(
    (date as string).indexOf("月") + 1,
    (date as string).indexOf("日")
  );
  const [items, setItems] = useState<Item[]>();

  useEffect(() => {
    const response = localStorage.getItem("loginData");
    if (response !== null && date) {
      const data = JSON.parse(response);
      (async () => {
        const itemsOfMonth = await getFireStore("users", data.id, years, months);
        const allItemsOfDay: Item[] = itemsOfMonth[day];
        setItems(allItemsOfDay);
      })();
    }
  }, []);

  const remainder = items && items.reduce((acc, cur) => acc + cur.price, 0);

  return (
    <>
      <div className={detailNote.container}>
        <div className={detailNote.dayRemainder}>
          <p>
            {years}/{months}/{day}{" "}
            {`星期${
              chineseDays[new Date(`${years}-${months}-${day}`).getDay()]
            }`}
          </p>
          <p>${remainder}</p>
        </div>
        <div className={detailNote.dayItems}>
          {items &&
            items.map((item) => (
              <div key={item.id} className={detailNote.itemGroup}>
                <div className={detailNote.percentGroup}>
                  <div className={detailNote.percent}>
                    <img src={`../images/${item.item}.png`} alt={item.item} />
                    <p>{item.note || item.item}</p>
                  </div>
                </div>
                <p
                  style={
                    item.price < 0
                      ? { color: "rgb(254,116,113)" }
                      : { color: "rgb(71,184,224)" }
                  }
                >
                  ${item.price}
                </p>
              </div>
            ))}
        </div>
      </div>
    </>
  );
};

export default RemainderNote;
