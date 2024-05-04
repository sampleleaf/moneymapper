import Calendar from "react-calendar";
import create from "@/css/Create.module.css";
import { v4 as uuidv4 } from "uuid";
import { db } from "@/utils/firebase";
import { doc, getDoc, setDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import MapFrame from "@/components/MapFrame";
import Budget from "@/components/Budget";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

const Create: React.FC<{ years: number; months: number }> = ({
  years,
  months,
}) => {
  const navigate = useNavigate();
  const date = new Date().getDate();
  const [value, onChange] = useState<Value>(
    new Date(`${years}-${months}-${date}`)
  );
  const [price, setPrice] = useState<string>("");
  const [mapWindow, setMapWindow] = useState<boolean>(false);
  const [location, setLocation] = useState<string | undefined>("");
  const [payItem, setPayItem] = useState<string>("早餐");
  const [incomeItem, setIncomeItem] = useState<string>("薪水");
  const [itemNote, setItemNote] = useState<string>("");
  const [payPage, setPayPage] = useState<boolean>(true);
  const [mapResult, setMapResult] = useState<string | undefined>("");
  const [isSending, setIsSending] = useState<boolean>(false);

  const handleClearLocation = () => {
    setLocation("");
    setMapResult("");
  };

  const handlePaySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
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
      setIsSending(false);
      toast.success("新增成功 !", {
        theme: "dark",
        position: "top-center",
      });
      navigate("/");
    }
  };

  const handleIncomeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
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
      setIsSending(false);
      toast.success("新增成功 !", {
        theme: "dark",
        position: "top-center",
      });
      navigate("/");
    }
  };

  const driverObj = driver({
    showProgress: true, // Because everyone loves progress bars!
    steps: [
      {
        element: ".calendarDriver",
        popover: {
          title: "確認日期",
          description: "可以點選來選擇日期",
          side: "bottom",
          align: "center",
        },
      },
      {
        element: "#budget",
        popover: {
          title: "選擇支出或收入",
          description: "可以切換不同圖示，圖示可以點選",
          side: "bottom",
          align: "center",
        },
      },
      {
        element: "#itemResult",
        popover: {
          title: "確認項目",
          description: "點選的圖示，會顯示在這邊",
          side: "top",
          align: "center",
        },
      },
      {
        element: "#price",
        popover: {
          title: "金額",
          description: "必填欄位，只能輸入數字",
          side: "top",
          align: "center",
        },
      },
      {
        element: "#note",
        popover: {
          title: "備註",
          description: "選填欄位，給喜歡詳細記錄的您",
          side: "top",
          align: "center",
        },
      },
      {
        element: "#location",
        popover: {
          title: "地區",
          description: "選填欄位，想查看地區收支記得要填",
          side: "top",
          align: "center",
        },
      },
      {
        element: "#submit",
        popover: {
          title: "提交",
          description: "確認填寫無誤的話，就送出吧!",
          side: "top",
          align: "center",
        },
      },
      // More magical steps...
    ],
  });

  return (
    <>
      {mapWindow && (
        <div className={create.mapSpace} onClick={() => setMapWindow(false)}>
          <div className={create.mapFrame} onClick={(e) => e.stopPropagation()}>
            <MapFrame
              setLocation={setLocation}
              setMapWindow={setMapWindow}
              mapResult={mapResult}
              setMapResult={setMapResult}
            />
          </div>
        </div>
      )}
      <div className={create.manual} onClick={() => driverObj.drive()} >
        <img src="manual.png" alt="manual" />
        <p>新手教學</p>
      </div>
      <div className={create.gridContainer}>
        <Calendar
          onChange={onChange}
          value={value}
          className="calendarDriver"
        />
        <div className={create.budgetContainer} id="budget">
          <div className={create.displayLargeScreen}>
            <Budget
              payPage={payPage}
              setPayPage={setPayPage}
              setPayItem={setPayItem}
              setIncomeItem={setIncomeItem}
            />
          </div>
          <div className={create.displaySmallScreen}>
            <Budget
              payPage={payPage}
              setPayPage={setPayPage}
              setPayItem={setPayItem}
              setIncomeItem={setIncomeItem}
            />
          </div>
        </div>
        <form
          className={create.formCard}
          onSubmit={payPage ? handlePaySubmit : handleIncomeSubmit}
        >
          <div className={create.inputGroup}>
            <div className={create.inputItem} id="itemResult">
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
              <label htmlFor="note">備註</label>
              <p>　</p>
              <div className={create.styleInput}>
                <input
                  id="note"
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
            <div className={create.inputFormat}>
              <label htmlFor="location">地區</label>
              <p>　</p>
              <div className={create.styleInput}>
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
          <div className={create.submit}>
            {isSending ? (
              <img src="loading.gif" alt="sending" />
            ) : (
              <button type="submit" id="submit">
                提交
              </button>
            )}
          </div>
        </form>
      </div>
    </>
  );
};

export default Create;
