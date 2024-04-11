import create from "@/css/Create.module.css";
import Map from "@/components/Map";
import { db } from "@/utils/firebase";
import { doc, setDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { useState } from "react";

const Create: React.FC = () => {
  const iconCount = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];

  const [price, setPrice] = useState('')
  const [mapWindow, setMapWindow] = useState<boolean>(false);
  const [location, setLocation] = useState<string | undefined>("");

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
      const specificUser = doc(db, "users", data.id);
      await updateDoc(specificUser, {
        'spend': arrayUnion({'晚餐': price})
      });
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
        {iconCount.map((icon) => (
          <div key={icon}>{icon}</div>
        ))}
      </div>
      <form onSubmit={handleSubmit}>
        <div className={create.item}>
          <div className={create.iconAndMoney}>
            <label htmlFor="icon">
              <i className="fa-solid fa-bread-slice"></i>
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
