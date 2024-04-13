import create from "@/css/Create.module.css";
import Map from "@/components/Map";
import { v4 as uuidv4 } from "uuid";
import { db } from "@/utils/firebase";
import { doc, getDoc, setDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

const Create: React.FC = () => {
  const [value, onChange] = useState<Value>(new Date());
  const [price, setPrice] = useState<string>("");
  const [mapWindow, setMapWindow] = useState<boolean>(false);
  const [location, setLocation] = useState<string | undefined>("");
  const [payItem, setPayItem] = useState<string>("早餐");
  const [incomeItem, setIncomeItem] = useState<string>("薪水")
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
            price: -parseInt(price),
            location: location,
          }),
        });
      } else {
        await setDoc(specificUser, {
          [day]: arrayUnion({
            id: uuidv4(),
            item: payItem,
            price: -parseInt(price),
            location: location,
          }),
        });
      }
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
            price: parseInt(price),
            location: location,
          }),
        });
      } else {
        await setDoc(specificUser, {
          [day]: arrayUnion({
            id: uuidv4(),
            item: incomeItem,
            price: parseInt(price),
            location: location,
          }),
        });
      }
    }
  };

  return (
    <>
      <div className={create.space}></div>
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
      <Calendar onChange={onChange} value={value} />
      <div className={create.header}>
        <div className={create.icon}>
          <i className="fa-solid fa-chevron-left"></i>
        </div>
        <div className={create.choose}>
          <div onClick={() => setPayPage(true)}>支出</div>
          <span className={create.vertical}></span>
          <div onClick={() => setPayPage(false)}>收入</div>
        </div>
        <div></div>
      </div>
      {payPage ? (
        <div className={create.iconList}>
          <div onClick={() => setPayItem("早餐")}>
            {/* <i className="fa-solid fa-bread-slice"></i> */}
            <p>早餐</p>
          </div>
          <div onClick={() => setPayItem("午餐")}>
            {/* <i className="fa-solid fa-bowl-rice"></i> */}
            <p>午餐</p>
          </div>
          <div onClick={() => setPayItem("晚餐")}>
            {/* <i className="fa-solid fa-utensils"></i> */}
            <p>晚餐</p>
          </div>
          <div onClick={() => setPayItem("飲品")}>
            {/* <i className="fa-solid fa-mug-hot"></i> */}
            <p>飲品</p>
          </div>
          <div onClick={() => setPayItem("點心")}>
            {/* <i className="fa-solid fa-ice-cream"></i> */}
            <p>點心</p>
          </div>
          <div onClick={() => setPayItem("交通")}>
            {/* <i className="fa-solid fa-bus"></i> */}
            <p>交通</p>
          </div>
          <div onClick={() => setPayItem("購物")}>
            {/* <i className="fa-solid fa-bag-shopping"></i> */}
            <p>購物</p>
          </div>
          <div onClick={() => setPayItem("娛樂")}>
            {/* <i className="fa-solid fa-gamepad"></i> */}
            <p>娛樂</p>
          </div>
          <div onClick={() => setPayItem("房租")}>
            {/* <i className="fa-solid fa-house-chimney-window"></i> */}
            <p>房租</p>
          </div>
          <div onClick={() => setPayItem("醫療")}>
            {/* <i className="fa-solid fa-hospital"></i> */}
            <p>醫療</p>
          </div>
          <div onClick={() => setPayItem("其他")}>
            {/* <i className="fa-brands fa-buromobelexperte"></i> */}
            <p>其他</p>
          </div>
        </div>
      ) : (
        <div className={create.iconList}>
          <div onClick={() => setIncomeItem("薪水")}>
            <p>薪水</p>
          </div>
          <div onClick={() => setIncomeItem("獎金")}>
            <p>獎金</p>
          </div>
          <div onClick={() => setIncomeItem("回饋")}>
            <p>回饋</p>
          </div>
          <div onClick={() => setIncomeItem("交易")}>
            <p>交易</p>
          </div>
          <div onClick={() => setIncomeItem("租金")}>
            <p>租金</p>
          </div>
          <div onClick={() => setIncomeItem("股息")}>
            <p>股息</p>
          </div>
          <div onClick={() => setIncomeItem("投資")}>
            <p>投資</p>
          </div>
          <div onClick={() => setIncomeItem("其他")}>
            <p>其他</p>
          </div>
        </div>
      )}
      <form onSubmit={payPage ? handlePaySubmit : handleIncomeSubmit}>
        <div className={create.item}>
          <div className={create.iconAndMoney}>
            <label htmlFor="icon">{payPage ? payItem : incomeItem}</label>
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
