import edit from "@/css/Edit.module.css";
import create from "@/css/Create.module.css";
import Map from "@/components/Map";
import Budget from "@/components/Budget";
import { db } from "@/utils/firebase";
import { doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
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
  const [price, setPrice] = useState<string>(`${Math.abs(item.price)}`);
  const [mapWindow, setMapWindow] = useState<boolean>(false);
  const [location, setLocation] = useState<string | undefined>(item.location);
  const [payItem, setPayItem] = useState<string>("");
  const [incomeItem, setIncomeItem] = useState<string>("");
  const [payPage, setPayPage] = useState<boolean>(
    item.price < 0 ? true : false
  );
  const [autoMap, setAutoMap] = useState(true);
  const [loadingLocation, setLoadingLocation] = useState(false)
  const [mapResult, setMapResult] = useState<string | undefined>('')

  const handleOpenMapWindow = () => {
    setMapWindow(true);
  };

  const handleCloseMapWindow = () => {
    setMapWindow(false);
  };

  const handleClearLocation = () => {
    setLocation("");
    setMapResult("")
  };


  const handleLocation = () => {
    // setMapResult(location)
    setLocation(mapResult)
    setMapWindow(false)
  }

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
            <div className={create.selectMap}>
              <div onClick={() => setAutoMap(true)} style={autoMap ? { opacity: "1" } : {}}>自動偵測</div>
              <div onClick={() => setAutoMap(false)} style={autoMap ? {} : { opacity: "1" }}>手動選擇</div>
            </div>
            {autoMap ? (
              <p className={create.hint}>點選地圖會自動偵測您的位置</p>
            ) : (
              <p className={create.hint}>點選地圖會顯示您選擇的位置</p>
            )}
            <Map setMapResult={setMapResult} autoMap={autoMap} setLoadingLocation={setLoadingLocation} />
            <div className={create.mapResult}>{mapResult ? <p>您的位置在<b>{mapResult}</b></p> : <p>您尚未選擇位置</p>}</div>
            <div className={create.mapButton}>
              {loadingLocation ? <img src="loading.gif" alt="loading" /> : <button onClick={handleLocation}>確定</button>}
            </div>
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
                {payPage ? payItem || (item.price < 0 ? item.item : '早餐') : incomeItem || (item.price > 0 ? item.item : '薪水')}
              </label>
              <input
                id="icon"
                type="text"
                pattern="[0-9]*"
                title="請輸入數字"
                value={price}
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
                value={location}
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
