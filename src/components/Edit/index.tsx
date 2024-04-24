import edit from "@/css/Edit.module.css";
import create from "@/css/Create.module.css";
import Map from "@/components/Map";
import Budget from "@/components/Budget";
import { db } from "@/utils/firebase";
import { doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { useState } from "react";
import { toast } from "react-toastify";

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

  const handleOpenMapWindow = () => {
    setMapWindow(true);
  };

  const handleCloseMapWindow = () => {
    setMapWindow(false);
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
          note: itemNote || item.item,
          price: -parseInt(price) || -Math.abs(item.price),
          location: location || item.location,
        }),
      });
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
      await updateDoc(docRef, {
        [day]: arrayUnion({
          id: item.id,
          item: incomeItem || item.item,
          note: itemNote || item.item,
          price: parseInt(price) || Math.abs(item.price),
          location: location || item.location,
        }),
      });
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
        {mapWindow && (
          <div className={create.mapSpace} onClick={handleCloseMapWindow}>
            <div
              className={create.mapFrame}
              onClick={(e) => e.stopPropagation()}
            >
              <div onClick={handleCloseMapWindow} className={create.cross}>
                <i className="fa-solid fa-xmark"></i>
              </div>
              <div className={create.selectMap}>
                <div
                  onClick={() => setAutoMap(true)}
                  style={autoMap ? { opacity: "1" } : {}}
                >
                  自動偵測
                </div>
                <div
                  onClick={() => setAutoMap(false)}
                  style={autoMap ? {} : { opacity: "1" }}
                >
                  手動選擇
                </div>
              </div>
              {autoMap ? (
                <div className={create.hint}>點選地圖會自動偵測您的位置</div>
              ) : (
                <div className={create.hint}>點選地圖會顯示您選擇的位置</div>
              )}
              <Map
                setMapResult={setMapResult}
                autoMap={autoMap}
                setLoadingLocation={setLoadingLocation}
                setMapError={setMapError}
              />
              <div className={create.mapResult}>
                {mapResult || mapError ? (
                  <p>
                    您的位置：
                    <b>
                      {mapResult}
                      {mapError}
                    </b>
                  </p>
                ) : (
                  <p>您尚未選擇位置</p>
                )}
              </div>
              <div className={create.mapButton}>
                {loadingLocation ? (
                  <img src="loading.gif" alt="loading" />
                ) : mapError ? (
                  "請選擇陸地或國家領海"
                ) : (
                  <button onClick={handleLocation}>確定</button>
                )}
              </div>
            </div>
          </div>
        )}
        <div className={edit.previous} onClick={handleCloseEdit}>
          <i className="fa-solid fa-chevron-left"></i>
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
          <div className={create.item}>
            <div className={create.iconAndMoney}>
              {/* <label htmlFor="icon">
                {payPage ? payItem || (item.price < 0 ? item.item : '早餐') : incomeItem || (item.price > 0 ? item.item : '薪水')}
              </label> */}
              <label htmlFor="icon">
                <img
                  src={
                    payPage
                      ? item.price < 0
                        ? `${payItem}.png`
                        : "早餐.png"
                      : item.price > 0
                      ? `${incomeItem}.png`
                      : "薪水.png"
                  }
                  alt={
                    payPage
                      ? item.price < 0
                        ? `${payItem}.png`
                        : "早餐.png"
                      : item.price > 0
                      ? `${incomeItem}.png`
                      : "薪水.png"
                  }
                />
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
              <input
                type="text"
                placeholder="在此輸入備註"
                value={itemNote}
                onChange={(e) => setItemNote(e.target.value)}
              />
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
            <button type="submit">更新</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Edit;
