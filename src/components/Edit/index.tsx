import edit from "@/css/Edit.module.css";
import create from "@/css/Create.module.css";
import Map from "@/components/Map";
import Budget from "@/components/Budget";
import { db } from "@/utils/firebase";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { useState } from "react";

const Edit: React.FC<{
  item: {
    id: string;
    location: string | undefined;
    price: number;
    item: string;
  };
  setPop: Function;
  setItemRemoved: Function;
  years: number;
  months: number;
  day: string;
}> = ({ item, setPop, setItemRemoved, years, months, day }) => {
  const [price, setPrice] = useState<string>("");
  const [mapWindow, setMapWindow] = useState<boolean>(false);
  const [location, setLocation] = useState<string | undefined>("");
  const [payItem, setPayItem] = useState<string>("");
  const [incomeItem, setIncomeItem] = useState<string>("");
  const [payPage, setPayPage] = useState<boolean>(true);

  const handleOpenMapWindow = () => {
    setMapWindow(true);
  };

  const handleCloseMapWindow = () => {
    setMapWindow(false);
  };

  const handleClearLocation = () => {
    setLocation("");
  };

  const handlePaySubmit = async (
    e: React.FormEvent,
    item: {
      id: string;
      location: string | undefined;
      price: number;
      item: string;
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
      await updateDoc(docRef, {
        [day]: arrayUnion({
          id: item.id,
          item: payItem || item.item,
          price: -parseInt(price) || -Math.abs(item.price),
          location: location || item.location,
        }),
      });
      setPop(false);
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
      await updateDoc(docRef, {
        [day]: arrayUnion({
          id: item.id,
          item: incomeItem || item.item,
          price: parseInt(price) || Math.abs(item.price),
          location: location || item.location,
        }),
      });
      setPop(false);
    }
    setItemRemoved(true);
  };

  return (
    <div
      // onClick={() => setPop(false)}
      className={edit.background}
    >
      <div className={edit.container}>
        {mapWindow && (
          <div className={create.mapSpace}>
            <div className={create.mapFrame}>
              <div onClick={handleCloseMapWindow} className={create.cross}>
                <i className="fa-solid fa-xmark"></i>
              </div>
              <p>點選地圖會自動偵測您的位置</p>
              <Map setLocation={setLocation} />
            </div>
          </div>
        )}
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
          <div className={create.item}>
            <div className={create.iconAndMoney}>
              <label htmlFor="icon">
                {(payPage ? payItem : incomeItem) || item.item}
              </label>
              <input
                id="icon"
                type="text"
                pattern="[0-9]*"
                title="請輸入數字"
                value={price || Math.abs(item.price)}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </div>
            <div></div>
            <div>
              <input type="text" placeholder="在此輸入備註" />
            </div>
          </div>
          <div className={create.locationLayout}>
            <div className={create.location}>
              <label htmlFor="location">消費區域</label>
              <input
                onClick={handleOpenMapWindow}
                id="location"
                type="text"
                value={location || item.location}
                autoComplete="off"
                onChange={() => setLocation}
              />
              <div
                onClick={handleClearLocation}
                className={create.clearLocation}
              >
                清空消費區域
              </div>
            </div>
          </div>
          <div className={create.submit}>
            <button type="submit">OK</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Edit;
