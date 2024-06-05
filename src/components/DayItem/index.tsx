import { arrayRemove, deleteField } from "firebase/firestore";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import Edit from "@/components/Edit";
import Loader from "@/components/Loader";
import dayItem from "@/css/DayItem.module.css";
import { Item } from "@/interfaces";
import { chineseDays } from "@/utils/constant";
import { getFireStore, updateFireStore } from "@/utils/reviseFireStore";
import { useDate } from "@/utils/zustand";

const DayItem: React.FC<{
  day: string;
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
  itemRemoved,
  setItemRemoved,
  popId,
  setPopId,
  popEdit,
  setPopEdit,
  remindDelete,
  setRemindDelete,
}) => {
  const { years, months } = useDate();

  const [items, setItems] = useState<Item[]>([]);
  const [isSending, setIsSending] = useState<boolean>(false);

  useEffect(() => {
    const response = localStorage.getItem("loginData");
    if (response !== null) {
      const data = JSON.parse(response);
      (async () => {
        const itemsOfMonth = await getFireStore("users", data.id, years, months);
        setItems(itemsOfMonth[day]);
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

  const handleItemRemove = async (item: object) => {
    setIsSending(true);
    const response = localStorage.getItem("loginData");
    if (response !== null) {
      const data = JSON.parse(response);
      const deleteItemOfDay = { [day]: arrayRemove(item) };
      await updateFireStore("users", data.id, years, months, deleteItemOfDay);
      //if [day] is empty array, delete it
      const itemsOfMonth = await getFireStore("users", data.id, years, months);
      if (itemsOfMonth[day].length === 0) {
        const deleteDay = { [day]: deleteField() };
        await updateFireStore("users", data.id, years, months, deleteDay);
      }
      setIsSending(false);
      setItemRemoved(true);
      setRemindDelete(false);
      toast.success("成功刪除 !", {
        position: "top-left",
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
                {years}年{months}月{day}日{" "}
                {`星期${
                  chineseDays[new Date(`${years}-${months}-${day}`).getDay()]
                }`}
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
                            <p onClick={() => handleItemRemove(item)}>
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
                  className={`${dayItem.items} ${
                    item.price > 0 && dayItem.incomeItems
                  }`}
                >
                  <div className={dayItem.item}>
                    <img src={`images/${item.item}.png`} alt={item.item} />
                    <p>{item.note || item.item}</p>
                  </div>
                  <p className={dayItem.price}>${item.price}</p>
                  <div
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
