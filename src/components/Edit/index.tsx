import edit from "@/css/Edit.module.css";
import MapFrame from "@/components/MapFrame";
import Budget from "@/components/Budget";
import Calendar from "react-calendar";
import Loader from "../Loader";
import { arrayUnion, arrayRemove, deleteField } from "firebase/firestore";
import { useState } from "react";
import { toast } from "react-toastify";
import { Item, Value } from "@/interfaces";
import { useDate } from "@/utils/zustand";
import {
  setFireStore,
  getFireStore,
  updateFireStore,
} from "@/utils/reviseFireStore";

const Edit: React.FC<{
  item: Item;
  setPopEdit: React.Dispatch<React.SetStateAction<boolean>>;
  setItemRemoved: React.Dispatch<React.SetStateAction<boolean>>;
  setPopId: React.Dispatch<React.SetStateAction<string>>;
  day: string;
}> = ({ item, setPopEdit, setItemRemoved, setPopId, day }) => {
  const { years, months } = useDate();

  const [price, setPrice] = useState<string>(`${Math.abs(item.price)}`);
  const [mapWindow, setMapWindow] = useState<boolean>(false);
  const [location, setLocation] = useState<string>(item.location);
  const [payItem, setPayItem] = useState<string>(
    item.price < 0 ? item.item : "早餐"
  );
  const [incomeItem, setIncomeItem] = useState<string>(
    item.price > 0 ? item.item : "薪水"
  );
  const [itemNote, setItemNote] = useState<string>(item.note);
  const [payPage, setPayPage] = useState<boolean>(
    item.price < 0 ? true : false
  );
  const [mapResult, setMapResult] = useState<string>("");
  const [value, onChange] = useState<Value>(
    new Date(`${years}-${months}-${day}`)
  );
  const [calendarWindow, setCalendarWindow] = useState<boolean>(false);
  const [isSending, setIsSending] = useState<boolean>(false);
  const [priceLimit, setPriceLimit] = useState<boolean>(false);
  const [priceHint, setPriceHint] = useState<string>("");
  const [noteLimit, setNoteLimit] = useState<boolean>(false);

  const handleChangeDay = (day: number) => {
    const newDate = new Date(value as Date);
    newDate.setDate(newDate.getDate() + day);
    onChange(newDate);
  };

  const handleClearLocation = () => {
    setLocation("");
    setMapResult("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    const response = localStorage.getItem("loginData");
    if (response !== null && value) {
      const data = JSON.parse(response);
      const deleteItemOfDay = { [day]: arrayRemove(item) };
      await updateFireStore("users", data.id, years, months, deleteItemOfDay);
      //if [day] is empty array, delete it
      const itemsOfMonth = await getFireStore("users", data.id, years, months);
      if (itemsOfMonth[day].length === 0) {
        const deleteDay = { [day]: deleteField() };
        await updateFireStore("users", data.id, years, months, deleteDay);
      }
      //update new
      const editDate = (value as Date).getDate();
      const editData = {
        [editDate]: arrayUnion({
          id: item.id,
          item: payPage ? payItem : incomeItem,
          note: itemNote,
          price: payPage ? -parseInt(price) : parseInt(price),
          location: location,
        }),
      };
      await setFireStore("users", data.id, editData, value);
      setIsSending(false);
      toast.success("編輯成功 !", {
        position: "top-left",
      });
      setPopEdit(false);
    }
    setItemRemoved(true);
  };

  const handleCloseEdit = () => {
    setPopId("");
    setPopEdit(false);
  };

  const handlePrice = (price: string) => {
    if (price[0] == "-" || price[0] == "+") {
      setPriceLimit(true);
      setPriceHint("請輸入數字");
    } else if (!price) {
      setPrice("");
      setPriceLimit(true);
      setPriceHint("請填寫金額");
    } else if (!Number(price)) {
      setPriceLimit(true);
      setPriceHint("請輸入數字");
    } else if (price.length < 10) {
      setPrice(price);
      setPriceLimit(false);
    } else {
      setPriceLimit(true);
      setPriceHint("最多9位數");
    }
  };

  const handleNote = (note: string) => {
    if (note.length < 100) {
      setNoteLimit(false);
      setItemNote(note);
    } else {
      setNoteLimit(true);
    }
  };

  return (
    <div onClick={handleCloseEdit} className={edit.background}>
      <div className={edit.container} onClick={(e) => e.stopPropagation()}>
        {calendarWindow && (
          <div
            className={edit.mapSpace}
            onClick={() => setCalendarWindow(false)}
          >
            <div
              className={edit.calendarFrame}
              onClick={(e) => e.stopPropagation()}
            >
              <Calendar onChange={onChange} value={value} />
              <div className={edit.calendarHint}>點選日期會自動儲存</div>
              <div
                className={edit.calendarBack}
                onClick={() => setCalendarWindow(false)}
              >
                OK
              </div>
            </div>
          </div>
        )}
        {mapWindow && (
          <div className={edit.mapSpace} onClick={() => setMapWindow(false)}>
            <div className={edit.mapFrame} onClick={(e) => e.stopPropagation()}>
              <MapFrame
                setLocation={setLocation}
                setMapWindow={setMapWindow}
                mapResult={mapResult}
                setMapResult={setMapResult}
              />
            </div>
          </div>
        )}
        <div className={edit.previous} onClick={handleCloseEdit}>
          <i className="fa-solid fa-chevron-left"></i>
        </div>
        <div className={edit.cross} onClick={handleCloseEdit}>
          <i className="fa-solid fa-xmark"></i>
        </div>
        <div className={edit.calendarBar}>
          <div onClick={() => handleChangeDay(-1)}>
            <i className="fa-solid fa-caret-left"></i>
          </div>
          <div onClick={() => setCalendarWindow(true)}>
            {(value as Date)?.getFullYear()}/{(value as Date)?.getMonth() + 1}/
            {(value as Date)?.getDate()}
          </div>
          <div onClick={() => handleChangeDay(1)}>
            <i className="fa-solid fa-caret-right"></i>
          </div>
        </div>
        <Budget
          payPage={payPage}
          setPayPage={setPayPage}
          setPayItem={setPayItem}
          setIncomeItem={setIncomeItem}
        />
        <form onSubmit={handleSubmit}>
          <div className={edit.inputGroup}>
            <div className={edit.inputItem}>
              <p>項目</p>
              <p>：</p>
              <img
                src={
                  payPage ? `images/${payItem}.png` : `images/${incomeItem}.png`
                }
                alt={
                  payPage ? `${payItem}` || "早餐" : `${incomeItem}` || "薪水"
                }
              />
            </div>
            <div className={edit.inputFormat}>
              <label htmlFor="price">金額</label>
              <p>＊</p>
              <div className={edit.styleInput}>
                <input
                  id="price"
                  type="text"
                  pattern="[0-9]*"
                  title="請輸入數字"
                  placeholder="請輸入金額"
                  autoComplete="off"
                  value={price}
                  onChange={(e) => handlePrice(e.target.value)}
                  required
                />
                <div>
                  <i className="fa-solid fa-file-invoice-dollar"></i>
                </div>
                {price && (
                  <span
                    onClick={() => {
                      setPrice("");
                      setPriceLimit(false);
                    }}
                  >
                    清空
                  </span>
                )}
                {priceLimit && <p>{priceHint}</p>}
              </div>
            </div>
            <div className={edit.inputFormat}>
              <label htmlFor="price">備註</label>
              <p>　</p>
              <div className={edit.styleInput}>
                <input
                  type="text"
                  placeholder="可輸入備註"
                  autoComplete="off"
                  value={itemNote}
                  onChange={(e) => handleNote(e.target.value)}
                />
                <div>
                  <i className="fa-solid fa-file-pen"></i>
                </div>
                {itemNote && (
                  <span
                    onClick={() => {
                      setItemNote("");
                      setNoteLimit(false);
                    }}
                  >
                    清空
                  </span>
                )}
                {noteLimit && <p>字數已達上限</p>}
              </div>
            </div>
            <div className={edit.inputFormat}>
              <label htmlFor="price">地區</label>
              <p>　</p>
              <div className={edit.styleInput}>
                <input
                  onClick={() => setMapWindow(true)}
                  id="location"
                  type="text"
                  value={location}
                  placeholder="點擊記錄地區"
                  autoComplete="off"
                  readOnly
                  onChange={() => setLocation}
                />
                <div>
                  <i className="fa-solid fa-map-location-dot"></i>
                </div>
                {location && <span onClick={handleClearLocation}>清空</span>}
              </div>
            </div>
          </div>
          <div className={edit.submit}>
            {isSending ? <Loader /> : <button type="submit">更新</button>}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Edit;
