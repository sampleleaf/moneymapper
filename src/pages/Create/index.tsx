import create from "@/css/Create.module.css";
import Map from "@/components/Map";
import { v4 as uuidv4 } from "uuid";
import { db } from "@/utils/firebase";
import { doc, getDoc, setDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import Calendar from "react-calendar";
import Budget from "@/components/Budget";
import "react-calendar/dist/Calendar.css";

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

const Create: React.FC = () => {
  const navigate = useNavigate();
  const [value, onChange] = useState<Value>(new Date());
  const [price, setPrice] = useState<string>("");
  const [mapWindow, setMapWindow] = useState<boolean>(false);
  const [location, setLocation] = useState<string | undefined>("");
  const [payItem, setPayItem] = useState<string>("早餐");
  const [incomeItem, setIncomeItem] = useState<string>("薪水");
  const [itemNote, setItemNote] = useState<string>("");
  const [payPage, setPayPage] = useState<boolean>(true);
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

  const handlePaySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = localStorage.getItem("loginData");
    if (response !== null && value) {
      const data = JSON.parse(response);
      const year = (value as Date).getFullYear().toString();
      const month = ((value as Date).getMonth() + 1).toString();
      const day = (value as Date).getDate();
      const specificUser = doc(db, "users", data.id, year, month);
      const docSnap = await getDoc(specificUser);
      if (docSnap.exists()) {
        await updateDoc(specificUser, {
          [day]: arrayUnion({
            id: uuidv4(),
            item: payItem,
            note: itemNote,
            price: -parseInt(price),
            location: location,
          }),
        });
      } else {
        await setDoc(specificUser, {
          [day]: arrayUnion({
            id: uuidv4(),
            item: payItem,
            note: itemNote,
            price: -parseInt(price),
            location: location,
          }),
        });
      }
      toast.success("新增成功 !", {
        theme: "dark",
        position: "top-center",
      });
      navigate("/");
    }
  };

  const handleIncomeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = localStorage.getItem("loginData");
    if (response !== null && value) {
      const data = JSON.parse(response);
      const year = (value as Date).getFullYear().toString();
      const month = ((value as Date).getMonth() + 1).toString();
      const day = (value as Date).getDate();
      const specificUser = doc(db, "users", data.id, year, month);
      const docSnap = await getDoc(specificUser);
      if (docSnap.exists()) {
        await updateDoc(specificUser, {
          [day]: arrayUnion({
            id: uuidv4(),
            item: incomeItem,
            note: itemNote,
            price: parseInt(price),
            location: location,
          }),
        });
      } else {
        await setDoc(specificUser, {
          [day]: arrayUnion({
            id: uuidv4(),
            item: incomeItem,
            note: itemNote,
            price: parseInt(price),
            location: location,
          }),
        });
      }
      toast.success("新增成功 !", {
        theme: "dark",
        position: "top-center",
      });
      navigate("/");
    }
  };

  return (
    <>
      {mapWindow && (
        <div className={create.mapSpace} onClick={handleCloseMapWindow}>
          <div className={create.mapFrame} onClick={(e) => e.stopPropagation()}>
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
      <div className={create.calendar}>
        <Calendar onChange={onChange} value={value} />
      </div>
      <Link to=".." className={create.back}>
        <i className="fa-solid fa-chevron-left"></i>
      </Link>
      <Budget
        payPage={payPage}
        setPayPage={setPayPage}
        setPayItem={setPayItem}
        setIncomeItem={setIncomeItem}
      />
      <form onSubmit={payPage ? handlePaySubmit : handleIncomeSubmit}>
        <div className={create.item}>
          <div className={create.iconAndMoney}>
            {/* <label htmlFor="icon">{payPage ? payItem : incomeItem}</label> */}
            <label htmlFor="icon">
              <img
                src={payPage ? `${payItem}.png` : `${incomeItem}.png`}
                alt={payPage ? payItem : incomeItem}
              />
            </label>
            <input
              id="icon"
              type="text"
              pattern="[0-9]*"
              title="請輸入數字"
              placeholder="請輸入金額"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>
          <div></div>
          <div>
            <input
              type="text"
              placeholder="可輸入備註"
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
            <div onClick={handleClearLocation} className={create.clearLocation}>
              清空消費區域
            </div>
          </div>
        </div>
        <div className={create.submit}>
          <button type="submit">OK</button>
        </div>
      </form>
    </>
  );
};

export default Create;
