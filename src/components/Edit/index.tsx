import edit from "@/css/Edit.module.css";
import create from "@/css/Create.module.css";
import Map from "@/components/Map";
import Budget from "@/components/Budget";
import Calendar from "react-calendar";
import { db } from "@/utils/firebase";
import {
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  getDoc,
  deleteField,
  setDoc,
} from "firebase/firestore";
import { useState } from "react";
import { toast } from "react-toastify";
import Switch from "react-switch";

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

const Edit: React.FC<{
  item: {
    id: string;
    location: string | undefined;
    price: number;
    item: string;
    note: string;
  };
  setPopEdit: Function;
  setItemRemoved: Function;
  setPopId: Function;
  years: number;
  months: number;
  day: string;
}> = ({ item, setPopEdit, setItemRemoved, setPopId, years, months, day }) => {
  const [price, setPrice] = useState<string>(`${Math.abs(item.price)}`);
  const [mapWindow, setMapWindow] = useState<boolean>(false);
  const [location, setLocation] = useState<string | undefined>(item.location);
  const [payItem, setPayItem] = useState<string>(item.item);
  const [incomeItem, setIncomeItem] = useState<string>(item.item);
  const [itemNote, setItemNote] = useState<string>(item.note);
  const [payPage, setPayPage] = useState<boolean>(
    item.price < 0 ? true : false
  );
  const [autoMap, setAutoMap] = useState<boolean>(true);
  const [loadingLocation, setLoadingLocation] = useState<boolean>(false);
  const [mapResult, setMapResult] = useState<string | undefined>("");
  const [mapError, setMapError] = useState<string | undefined>("");

  const [value, onChange] = useState<Value>(
    new Date(`${years}-0${months}-${day}`)
  ); //1704408076738
  const [calendarWindow, setCalendarWindow] = useState<boolean>(false);

  const handleYesterday = () => {
    const newDate = new Date(value as Date);
    newDate.setDate(newDate.getDate() - 1);
    onChange(newDate);
  };

  const handleTommorrow = () => {
    const newDate = new Date(value as Date);
    newDate.setDate(newDate.getDate() + 1);
    onChange(newDate);
  };

  const handleOpenMapWindow = () => {
    setMapWindow(true);
  };

  const handleCloseMapWindow = () => {
    setMapWindow(false);
  };

  const handleChange = (nextChecked: boolean) => {
    setAutoMap(nextChecked);
  };

  const handleClearLocation = () => {
    setLocation("");
    setMapResult("");
  };

  const handleLocation = () => {
    // setMapResult(location)
    setLocation(mapResult);
    setMapWindow(false);
  };

  const handlePaySubmit = async (
    e: React.FormEvent,
    item: {
      id: string;
      location: string | undefined;
      price: number;
      item: string;
      note: string;
    }
  ) => {
    e.preventDefault();
    const response = localStorage.getItem("loginData");
    const yearString = years.toString();
    const monthString = months.toString();
    if (response !== null && value) {
      console.log(value);
      const data = JSON.parse(response);
      const docRef = doc(db, "users", data.id, yearString, monthString);
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
      //update new
      const editYear = (value as Date).getFullYear().toString();
      const editMonth = ((value as Date).getMonth() + 1).toString();
      const editDate = (value as Date).getDate();
      const editRef = doc(db, "users", data.id, editYear, editMonth);
      const editSnap = await getDoc(editRef);
      if (editSnap.exists()) {
        await updateDoc(editRef, {
          [editDate]: arrayUnion({
            id: item.id,
            item: payItem || item.item,
            note: itemNote,
            price:
              parseInt(price) == 0
                ? 0
                : -parseInt(price) || -Math.abs(item.price),
            location: location,
          }),
        });
      } else {
        await setDoc(editRef, {
          [editDate]: arrayUnion({
            id: item.id,
            item: payItem || item.item,
            note: itemNote,
            price:
              parseInt(price) == 0
                ? 0
                : -parseInt(price) || -Math.abs(item.price),
            location: location,
          }),
        });
      }
      toast.success("編輯成功 !", {
        theme: "dark",
        position: "top-center",
      });
      setPopEdit(false);
    }
    setItemRemoved(true);
  };

  const handleIncomeSubmit = async (
    e: React.FormEvent,
    item: {
      id: string;
      location: string | undefined;
      price: number;
      item: string;
      note: string;
    }
  ) => {
    e.preventDefault();
    const response = localStorage.getItem("loginData");
    const yearString = years.toString();
    const monthString = months.toString();
    if (response !== null) {
      const data = JSON.parse(response);
      const docRef = doc(db, "users", data.id, yearString, monthString);
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
      //update new
      const editYear = (value as Date).getFullYear().toString();
      const editMonth = ((value as Date).getMonth() + 1).toString();
      const editDate = (value as Date).getDate();
      const editRef = doc(db, "users", data.id, editYear, editMonth);
      const editSnap = await getDoc(editRef);
      if (editSnap.exists()) {
        await updateDoc(editRef, {
          [editDate]: arrayUnion({
            id: item.id,
            item: incomeItem || item.item,
            note: itemNote,
            price:
              parseInt(price) == 0
                ? 0
                : parseInt(price) || Math.abs(item.price),
            location: location,
          }),
        });
      } else {
        await setDoc(editRef, {
          [editDate]: arrayUnion({
            id: item.id,
            item: incomeItem || item.item,
            note: itemNote,
            price:
              parseInt(price) == 0
                ? 0
                : parseInt(price) || Math.abs(item.price),
            location: location,
          }),
        });
      }
      toast.success("編輯成功 !", {
        theme: "dark",
        position: "top-center",
      });
      setPopEdit(false);
    }
    setItemRemoved(true);
  };

  const handleCloseEdit = () => {
    setPopId("");
    setPopEdit(false);
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
          <div className={edit.mapSpace} onClick={handleCloseMapWindow}>
            <div className={edit.mapFrame} onClick={(e) => e.stopPropagation()}>
              <div onClick={handleCloseMapWindow} className={edit.cross}>
                <i className="fa-solid fa-xmark"></i>
              </div>
              <div className={create.selectMap}>
                <div
                  className={`${create.autoButton} ${
                    autoMap ? create.autoMapOn : ""
                  }`}
                >
                  自動偵測
                </div>
                <Switch onChange={handleChange} checked={autoMap} />
              </div>
              {autoMap ? (
                <div className={create.hint}>
                  點選地圖會
                  <b style={{ color: "lightgreen" }}>偵測您目前的位置</b>
                </div>
              ) : (
                <div className={create.hint}>
                  點選地圖會<b style={{ color: "yellow" }}>顯示您選擇的位置</b>
                </div>
              )}
              <Map
                setMapResult={setMapResult}
                autoMap={autoMap}
                setLoadingLocation={setLoadingLocation}
                setMapError={setMapError}
              />
              <div className={create.mapResult}>
                {mapResult || mapError ? (
                  <p
                    style={
                      mapResult ? { backgroundColor: "rgb(189,218,177)" } : {}
                    }
                  >
                    您的位置：
                    <b>
                      {mapResult}
                      {mapError}
                    </b>
                  </p>
                ) : (
                  <p>您尚未選擇地區</p>
                )}
              </div>
              <div className={create.mapButton}>
                {loadingLocation ? (
                  <img src="loading.gif" alt="loading" />
                ) : mapError ? (
                  "請選擇陸地或國家領海"
                ) : mapResult ? (
                  <button onClick={handleLocation}>確定</button>
                ) : (
                  "選完地區，會出現確定按鈕"
                )}
              </div>
            </div>
          </div>
        )}
        <div className={edit.previous} onClick={handleCloseEdit}>
          <i className="fa-solid fa-chevron-left"></i>
        </div>
        <div className={edit.calendarBar}>
          <div onClick={handleYesterday}>
            <i className="fa-solid fa-caret-left"></i>
          </div>
          <div onClick={() => setCalendarWindow(true)}>
            {(value as Date)?.getFullYear()}/{(value as Date)?.getMonth() + 1}/
            {(value as Date)?.getDate()}
          </div>
          <div onClick={handleTommorrow}>
            <i className="fa-solid fa-caret-right"></i>
          </div>
        </div>
        <Budget
          payPage={payPage}
          setPayPage={setPayPage}
          setPayItem={setPayItem}
          setIncomeItem={setIncomeItem}
        />
        <form
          onSubmit={
            payPage
              ? (e) => handlePaySubmit(e, item)
              : (e) => handleIncomeSubmit(e, item)
          }
        >
          <div className={edit.inputGroup}>
            <div className={edit.inputItem}>
              <p>項目</p>
              <p>：</p>
              <img
                src={
                  payPage
                    ? `${payItem}.png` || "早餐.png"
                    : `${incomeItem}.png` || "薪水.png"
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
                  onChange={(e) => setPrice(e.target.value)}
                  required
                />
                <div>
                  <i className="fa-solid fa-file-invoice-dollar"></i>
                </div>
                {price && <span onClick={() => setPrice("")}>清空</span>}
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
                  onChange={(e) => setItemNote(e.target.value)}
                />
                <div>
                  <i className="fa-solid fa-file-pen"></i>
                </div>
                {itemNote && <span onClick={() => setItemNote("")}>清空</span>}
              </div>
            </div>
            <div className={edit.inputFormat}>
              <label htmlFor="price">地區</label>
              <p>　</p>
              <div className={edit.styleInput}>
                <input
                  onClick={handleOpenMapWindow}
                  id="location"
                  type="text"
                  value={location}
                  placeholder="點擊記錄地區"
                  autoComplete="off"
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
            <button type="submit">更新</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Edit;
