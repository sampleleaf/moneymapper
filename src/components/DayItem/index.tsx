import dayItem from "@/css/DayItem.module.css";
import { db } from "@/utils/firebase";
import Edit from "@/components/Edit";
import {
  doc,
  getDoc,
  updateDoc,
  arrayRemove,
  deleteField,
} from "firebase/firestore";
import { useEffect, useState } from "react";

const DayItem: React.FC<{
  day: string;
  months: number;
  years: number;
  itemRemoved: boolean;
  setItemRemoved: Function;
  popEdit: boolean;
  setPopEdit: Function;
  remindDelete: boolean;
  setRemindDelete: Function;
}> = ({ day, months, years, itemRemoved, setItemRemoved, popEdit, setPopEdit, remindDelete, setRemindDelete }) => {
  const [items, setItems] = useState<{ id: string; item: string; price: number; location: string | undefined }[]>([]);
  const [popId, setPopId] = useState<string>("");

  useEffect(() => {
    const response = localStorage.getItem("loginData");
    if (response !== null) {
      const data = JSON.parse(response);
      (async () => {
        const yearString = years.toString();
        const monthString = months.toString();
        const docRef = doc(db, "users", data.id, yearString, monthString);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          //   console.log("Document data:", docSnap.data());
          // console.log(docSnap.data()[day]);
          setItems(docSnap.data()[day]);
        } else {
          // docSnap.data() will be undefined in this case
          console.log("No such document!");
        }
      })();
    }
    return () => setItemRemoved(false);
  }, [itemRemoved]);

  const handleEdit = (id: string) => {
    setPopEdit(true);
    setPopId(id);
  };

  const handleDeleteRemind = (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    setRemindDelete(true)
    setPopId(id)
  }

  const handleItemRemove = async (e: React.MouseEvent ,item: object, day: string) => {
    e.stopPropagation()
    const response = localStorage.getItem("loginData");
    if (response !== null) {
      const data = JSON.parse(response);
      const yearString = years.toString();
      const monthString = months.toString();
      const docRef = doc(db, "users", data.id, yearString, monthString);
      console.log(item);
      await updateDoc(docRef, {
        [day]: arrayRemove(item),
      });
      //if [day] is empty array, delete it
      const docSnapshot = await getDoc(docRef);
      const docData = docSnapshot.data();
      if (docData && Array.isArray(docData[day]) && docData[day].length === 0) {
        await updateDoc(docRef, {
          [day]: deleteField(),
        });
      }
      setItemRemoved(true);
    }
  };
  return (
    <>
      {items && (
        <div>
          <div className={dayItem.dateAndRemainder}>
            <div className={dayItem.date}>
              <p>
                {years}年{months}月{day}日
              </p>
            </div>
            <p>
              ${items.reduce((acc, cur) => acc + cur.price, 0)}
            </p>
          </div>
          <div className={dayItem.line}></div>
          <div className={dayItem.itemsByDay}>
            {items.map((item) => (
              <div key={item.id}>
                {popEdit && popId === item.id && (
                  <Edit item={item} setPopEdit={setPopEdit} setItemRemoved={setItemRemoved} years={years} months={months} day={day} />
                )}
                <div onClick={() => handleEdit(item.id)} className={dayItem.items}>
                  <div className={dayItem.item}>
                    <p style={item.price < 0 ? {backgroundColor: "rgb(253,201,83)"} : {backgroundColor : "rgb(71,184,224)"}}>{item.item}</p>
                  </div>
                  <p>${item.price}</p>
                  <div
                    // onClick={(e) => handleItemRemove(e, item, day)}
                    onClick={(e) => handleDeleteRemind(e, item.id)}
                    className={dayItem.trash}
                  >
                    <i className="fa-regular fa-trash-can"></i>
                    {remindDelete && popId === item.id && <div className={dayItem.background}>{item.id}</div>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default DayItem;
