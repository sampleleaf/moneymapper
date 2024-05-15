import dayItem from "@/css/DayItem.module.css";
import { db } from "@/utils/firebase";
import Edit from "@/components/Edit";
import Loader from "../Loader";
import {
  doc,
  getDoc,
  updateDoc,
  arrayRemove,
  deleteField,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface Item {
  id: string;
  item: string;
  note: string;
  price: number;
  location: string;
}

const DayItem: React.FC<{
  day: string;
  months: number;
  years: number;
  itemRemoved: boolean;
  setItemRemoved: React.Dispatch<React.SetStateAction<boolean>>;
  popId: string;
  setPopId: React.Dispatch<React.SetStateAction<string>>;
  popEdit: boolean;
  setPopEdit: React.Dispatch<React.SetStateAction<boolean>>;
  remindDelete: boolean;
  setRemindDelete: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({
  day,
  months,
  years,
  itemRemoved,
  setItemRemoved,
  popId,
  setPopId,
  popEdit,
  setPopEdit,
  remindDelete,
  setRemindDelete,
}) => {
  const [items, setItems] = useState<Item[]>([]);
  const [isSending, setIsSending] = useState<boolean>(false);

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
          setItems(docSnap.data()[day]);
        }
      })();
    }
    return () => setItemRemoved(false);
  }, [itemRemoved, months, years]);

  const handleEdit = (id: string) => {
    setPopEdit(true);
    setPopId(id);
  };

  const handleDeleteRemind = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setRemindDelete(true);
    setPopId(id);
  };

  const handleItemRemove = async (
    e: React.MouseEvent,
    item: object,
    day: string
  ) => {
    e.stopPropagation();
    setIsSending(true)
    const response = localStorage.getItem("loginData");
    if (response !== null) {
      const data = JSON.parse(response);
      const yearString = years.toString();
      const monthString = months.toString();
      const docRef = doc(db, "users", data.id, yearString, monthString);
      // console.log(item);
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
      setIsSending(false)
      setItemRemoved(true);
      setRemindDelete(false);
      toast.success("成功刪除 !", {
        position: "top-left",
      });
    }
  };

  const remainder = items && items.reduce((acc, cur) => acc + cur.price, 0);
  const chineseDays = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];

  return (
    <>
      {items && (
        <div>
          <div className={dayItem.dateAndRemainder}>
            <div className={dayItem.date}>
              <p>
                {years}年{months}月{day}日 {`${chineseDays[new Date(`${years}-${months}-${day}`).getDay()]}`}
              </p>
            </div>
            <p
              style={
                remainder < 0
                  ? { color: "rgb(254,116,113)" }
                  : { color: "rgb(71,184,224)" }
              }
            >
              ${remainder}
            </p>
          </div>
          <div className={dayItem.line}></div>
          <div className={dayItem.itemsByDay}>
            {items.map((item) => (
              <div key={item.id}>
                {popEdit && popId === item.id && (
                  <Edit
                    item={item}
                    setPopEdit={setPopEdit}
                    setItemRemoved={setItemRemoved}
                    setPopId={setPopId}
                    years={years}
                    months={months}
                    day={day}
                  />
                )}
                {remindDelete && popId === item.id && (
                  <div
                    onClick={() => setRemindDelete(false)}
                    className={dayItem.background}
                  >
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className={dayItem.remindWindow}
                    >
                      <p>系統通知</p>
                      <p>
                        確定要刪除此筆<b>{item.item}</b>記錄？
                      </p>
                      <div className={dayItem.deleteChoice}>
                        {isSending ? (
                          <div className={dayItem.sending}>
                            <Loader />
                          </div>
                        ) : (
                          <>
                            <p onClick={() => setRemindDelete(false)}>取消</p>
                            <p onClick={(e) => handleItemRemove(e, item, day)}>
                              確認刪除
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                )}
                <div
                  onClick={() => handleEdit(item.id)}
                  className={`${dayItem.items} ${item.price > 0 && dayItem.incomeItems}`}
                >
                  <div className={dayItem.item}>
                    <img src={`images/${item.item}.png`} alt={item.item} />
                    <p>{item.note || item.item}</p>
                  </div>
                  <p className={dayItem.price}>${item.price}</p>
                  <div
                    // onClick={(e) => handleItemRemove(e, item, day)}
                    onClick={(e) => handleDeleteRemind(e, item.id)}
                    className={dayItem.trash}
                  >
                    <i className="fa-regular fa-trash-can"></i>
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
