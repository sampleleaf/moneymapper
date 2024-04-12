import home from '@/css/Home.module.css'
import { db } from "@/utils/firebase";
import { doc, getDoc, updateDoc, arrayRemove } from "firebase/firestore";
import { useEffect, useState } from "react";

const DayItem: React.FC<{day: string}> = ({day}) => {
    const [items, setItems] = useState<
    {
      id: string;
      item: string;
      price: number;
    }[]
  >([]);

  const [itemRemoved, setItemRemoved] = useState<boolean>(false)

  useEffect(() => {
    const response = localStorage.getItem("loginData");
    if (response !== null) {
      const data = JSON.parse(response);
      (async () => {
        const docRef = doc(db, "users", data.id, "2024", "4");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
        //   console.log("Document data:", docSnap.data());
          setItems(docSnap.data()[day]);
        } else {
          // docSnap.data() will be undefined in this case
          console.log("No such document!");
        }
      })();
    }
    return () => setItemRemoved(false)

  }, [itemRemoved]);

  const handleItemRemove = async (id: object, day: string) => {
    const response = localStorage.getItem("loginData");
    if (response !== null) {
      const data = JSON.parse(response);
      const docRef = doc(db, "users", data.id, "2024", "4");
      await updateDoc(docRef, {       
        [day]: arrayRemove(id)
      });
      setItemRemoved(true)
    }
  };
  return (
    <div>
      <div className={home.dateAndRemainder}>
        <div className={home.date}>
          <p>2024年4月{day}日</p>
        </div>
        <p className={home.dayRemainder}>
          ${items && items.reduce((acc, cur) => acc + cur.price, 0)}
        </p>
      </div>
      <div className={home.line}></div>
      <div className={home.itemsByDay}>
        {items &&
          items.map((item) => (
            <div key={item.id} className={home.items}>
              <div className={home.item}>
                <p>{item.item}</p>
              </div>
              <p>${item.price}</p>
              <div
                onClick={() => handleItemRemove(item, day)}
                className={home.trash}
              >
                <i className="fa-regular fa-trash-can"></i>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default DayItem;
