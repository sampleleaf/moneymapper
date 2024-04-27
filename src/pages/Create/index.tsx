import Calendar from "react-calendar";
// import "react-calendar/dist/Calendar.css";
import create from "@/css/Create.module.css";
import Map from "@/components/Map";
import { v4 as uuidv4 } from "uuid";
import { db } from "@/utils/firebase";
import { doc, getDoc, setDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Budget from "@/components/Budget";

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
      <div className={create.gridContainer}>
        <Calendar onChange={onChange} value={value} />
        {/* <Link to=".." className={create.back}>
          <i className="fa-solid fa-house"></i>
        </Link> */}
        <div className={create.displayLargeScreen}>
          <Budget
            payPage={payPage}
            setPayPage={setPayPage}
            setPayItem={setPayItem}
            setIncomeItem={setIncomeItem}
          />
        </div>
        <div className={create.iconCard}>
          <div className={create.displaySmallScreen}>
            <Budget
              payPage={payPage}
              setPayPage={setPayPage}
              setPayItem={setPayItem}
              setIncomeItem={setIncomeItem}
            />
          </div>
          <form onSubmit={payPage ? handlePaySubmit : handleIncomeSubmit}>
            <div className={create.inputGroup}>
              <div className={create.inputItem}>
                <p>項目</p>
                <p>：</p>
                <img
                  src={payPage ? `${payItem}.png` : `${incomeItem}.png`}
                  alt={payPage ? payItem : incomeItem}
                />
              </div>
              <div className={create.inputFormat}>
                <label htmlFor="price">金額</label>
                <p>＊</p>
                <div className={create.styleInput}>
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
              <div className={create.inputFormat}>
                <label htmlFor="price">備註</label>
                <p>　</p>
                <div className={create.styleInput}>
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
                  {itemNote && (
                    <span onClick={() => setItemNote("")}>清空</span>
                  )}
                </div>
              </div>
              <div className={create.inputFormat}>
                <label htmlFor="price">地區</label>
                <p>　</p>
                <div className={create.styleInput}>
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
            <div className={create.submit}>
              <button type="submit">提交</button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Create;
