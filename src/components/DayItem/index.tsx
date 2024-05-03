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
import { toast } from "react-toastify";

const DayItem: React.FC<{
  day: string;
  months: number;
  years: number;
  itemRemoved: boolean;
  setItemRemoved: Function;
  popId: string;
  setPopId: Function;
  popEdit: boolean;
  setPopEdit: Function;
  remindDelete: boolean;
  setRemindDelete: Function;
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
  const [items, setItems] = useState<
    {
      id: string;
      item: string;
      src: string;
      note: string;
      price: number;
      location: string | undefined;
    }[]
  >([]);
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
      setIsSending(false)
      setItemRemoved(true);
      setRemindDelete(false);
      toast.success("成功刪除 !", {
        theme: "dark",
        position: "top-center",
      });
    }
  };

  const remainder = items && items.reduce((acc, cur) => acc + cur.price, 0);

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
            <p
              style={
                remainder < 0
                  ? { color: "rgb(255,179,0)" }
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
                        請問您確定要刪除此筆<b>{item.item}</b>記錄
                      </p>
                      <div className={dayItem.deleteChoice}>
                        {isSending ? (
                          <p className={dayItem.sending}>
                            <img src="loading.gif" alt="sending" />
                          </p>
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
                    <img src={`${item.item}.png`} alt={item.src} />
                    <p /*style={item.price < 0 ? {backgroundColor: "rgb(253,201,83)"} : {backgroundColor : "rgb(71,184,224)"}}*/
                    >
                      {item.note || item.item}
                    </p>
                  </div>
                  <p>${item.price}</p>
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
