import create from "@/css/Create.module.css";
import Map from "@/components/Map";
import { v4 as uuidv4 } from "uuid";
import { db } from "@/utils/firebase";
import {
  doc,
  updateDoc,
  arrayUnion,
  collection,
  addDoc,
  setDoc,
} from "firebase/firestore";
import { useState } from "react";

const Create: React.FC = () => {
  const [price, setPrice] = useState("");
  const [mapWindow, setMapWindow] = useState<boolean>(false);
  const [location, setLocation] = useState<string | undefined>("");
  const [item, setItem] = useState("早餐");

  const handleOpenMapWindow = () => {
    setMapWindow(true);
  };

  const handleCloseMapWindow = () => {
    setMapWindow(false);
  };

  const handleClearLocation = () => {
    setLocation("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = localStorage.getItem("loginData");
    if (response !== null) {
      const data = JSON.parse(response);
      const specificUser = doc(db, "users", data.id, "2024", "4");
      await updateDoc(specificUser, {
        11: arrayUnion({
          id: uuidv4(),
          item: item,
          price: -parseInt(price),
          location: location
        }),
      });
      //   await updateDoc(specificUser, {
      //     pay: arrayUnion({
      //       id: uuidv4(),
      //       item: item,
      //       price: -parseInt(price),
      //       location: location,
      //       year: "2024",
      //       month: "4",
      //       day: "11",
      //     }),
      //   });
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
      <div className={create.header}>
        <div className={create.icon}>
          <i className="fa-solid fa-chevron-left"></i>
        </div>
        <div className={create.choose}>
          <div>支出</div>
          <span className={create.vertical}></span>
          <div>收入</div>
        </div>
        <div></div>
      </div>
      <div className={create.iconList}>
        <div onClick={() => setItem("早餐")}>
          <i className="fa-solid fa-bread-slice"></i>
          <p>早餐</p>
        </div>
        <div onClick={() => setItem("午餐")}>
          <i className="fa-solid fa-bowl-rice"></i>
          <p>午餐</p>
        </div>
        <div onClick={() => setItem("晚餐")}>
          <i className="fa-solid fa-utensils"></i>
          <p>晚餐</p>
        </div>
        <div onClick={() => setItem("飲品")}>
          <i className="fa-solid fa-mug-hot"></i>
          <p>飲品</p>
        </div>
        <div onClick={() => setItem("點心")}>
          <i className="fa-solid fa-ice-cream"></i>
          <p>點心</p>
        </div>
        <div onClick={() => setItem("交通")}>
          <i className="fa-solid fa-bus"></i>
          <p>交通</p>
        </div>
        <div onClick={() => setItem("購物")}>
          <i className="fa-solid fa-bag-shopping"></i>
          <p>購物</p>
        </div>
        <div onClick={() => setItem("娛樂")}>
          <i className="fa-solid fa-gamepad"></i>
          <p>娛樂</p>
        </div>
        <div onClick={() => setItem("房租")}>
          <i className="fa-solid fa-house-chimney-window"></i>
          <p>房租</p>
        </div>
        <div onClick={() => setItem("醫療")}>
          <i className="fa-solid fa-hospital"></i>
          <p>醫療</p>
        </div>
        <div onClick={() => setItem("其他")}>
          <i className="fa-brands fa-buromobelexperte"></i>
          <p>其他</p>
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        <div className={create.item}>
          <div className={create.iconAndMoney}>
            <label htmlFor="icon">{item}</label>
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
