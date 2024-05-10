import Calendar from "react-calendar";
import create from "@/css/Create.module.css";
import Loader from "@/components/Loader";
import { v4 as uuidv4 } from "uuid";
import { db } from "@/utils/firebase";
import { doc, getDoc, setDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import MapFrame from "@/components/MapFrame";
import Budget from "@/components/Budget";
import { driver } from "driver.js";

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

const Create: React.FC<{
  years: number;
  months: number;
  payPage: boolean;
  setPayPage: Function;
}> = ({ years, months, payPage, setPayPage }) => {
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
  const [mapResult, setMapResult] = useState<string | undefined>("");
  const [isSending, setIsSending] = useState<boolean>(false);
  const [priceLimit, setPriceLimit] = useState<boolean>(false);
  const [priceHint, setPriceHint] = useState<string>("");
  const [noteLimit, setNoteLimit] = useState<boolean>(false);

  useEffect(() => {
    const response = localStorage.getItem("loginData");
    (async () => {
      if (response !== null) {
        const data = JSON.parse(response);
        if (data.driverStep === 1) {
          driverObj.drive();
          data.driverStep = 2;
          localStorage.setItem("loginData", JSON.stringify(data));
          const docRef = doc(db, "users", data.id);
          await updateDoc(docRef, {
            driverStep: 2,
          });
        }
      }
    })();
  }, []);

  const handleClearLocation = () => {
    setLocation("");
    setMapResult("");
  };

  const handleSubmit = async (e: React.FormEvent, isPay: boolean) => {
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
      const operationItem = isPay ? payItem : incomeItem;
      const operationPrice = isPay ? -parseInt(price) : parseInt(price);
      if (docSnap.exists()) {
        await updateDoc(specificUser, {
          [day]: arrayUnion({
            id: uuidv4(),
            item: operationItem,
            note: itemNote,
            price: operationPrice,
            location: location,
          }),
        });
      } else {
        await setDoc(specificUser, {
          [day]: arrayUnion({
            id: uuidv4(),
            item: operationItem,
            note: itemNote,
            price: operationPrice,
            location: location,
          }),
        });
      }
      setIsSending(false);
      toast.success("新增成功 !", {
        position: "top-left",
      });
      if (data.driverStep === 2) {
        data.driverStep = 3;
        localStorage.setItem("loginData", JSON.stringify(data));
        const docRef = doc(db, "users", data.id);
        await updateDoc(docRef, {
          driverStep: 3,
        });
      }
      navigate("/");
    }
  };

  const handlePaySubmit = (e: React.FormEvent) => {
    handleSubmit(e, true);
  };

  const handleIncomeSubmit = (e: React.FormEvent) => {
    handleSubmit(e, false);
  };

  const handlePrice = (price: string) => {
    if (price[0] == "-" || price[0] == "+") {
      setPriceLimit(true);
      setPriceHint("請輸入數字");
    } else if (!price) {
      setPrice("");
      setPriceLimit(true);
      setPriceHint("請填寫金額");
    } else if (!Number(price)) {
      setPriceLimit(true);
      setPriceHint("請輸入數字");
    } else if (price.length < 10) {
      setPrice(price);
      setPriceLimit(false);
    } else {
      setPriceLimit(true);
      setPriceHint("最多9位數");
    }
  };

  const handleNote = (note: string) => {
    if (note.length < 100) {
      setNoteLimit(false);
      setItemNote(note);
    } else {
      setNoteLimit(true);
    }
  };

  const driverObj = driver({
    showProgress: true,
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
      // More steps...
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
      <div className="manualDriver" onClick={() => driverObj.drive()}>
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
                  onChange={(e) => handlePrice(e.target.value)}
                  required
                />
                <div>
                  <i className="fa-solid fa-file-invoice-dollar"></i>
                </div>
                {price && (
                  <span
                    onClick={() => {
                      setPrice("");
                      setPriceLimit(false);
                    }}
                  >
                    清空
                  </span>
                )}
                {priceLimit && <p>{priceHint}</p>}
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
                  onChange={(e) => handleNote(e.target.value)}
                />
                <div>
                  <i className="fa-solid fa-file-pen"></i>
                </div>
                {itemNote && (
                  <span
                    onClick={() => {
                      setItemNote("");
                      setNoteLimit(false);
                    }}
                  >
                    清空
                  </span>
                )}
                {noteLimit && <p>字數達上限</p>}
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
              <Loader />
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
