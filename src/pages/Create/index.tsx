import { arrayUnion, doc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";

import Budget from "@/components/Budget";
import Loader from "@/components/Loader";
import MapFrame from "@/components/MapFrame";
import { createDriver } from "@/utils/driver";
import { db } from "@/utils/firebase";
import { setFireStore } from "@/utils/reviseFireStore";
import { useDate, useFinance } from "@/utils/zustand";

import create from "./Create.module.css";

const Create: React.FC = () => {
  const navigate = useNavigate();

  const { calendarDate, setCalendarDate } = useDate();
  const { payPage, setPayPage } = useFinance();

  const [price, setPrice] = useState<string>("");
  const [mapWindow, setMapWindow] = useState<boolean>(false);
  const [location, setLocation] = useState<string>("");
  const [payItem, setPayItem] = useState<string[]>(["早餐", "breakfast"]);
  const [incomeItem, setIncomeItem] = useState<string[]>(["薪水", "salary"]);
  const [itemNote, setItemNote] = useState<string>("");
  const [mapResult, setMapResult] = useState<string>("");
  const [isSending, setIsSending] = useState<boolean>(false);
  const [isPriceValid, setIsPriceValid] = useState<boolean>(true);
  const [priceHint, setPriceHint] = useState<string>("");
  const [isNoteValid, setIsNoteValid] = useState<boolean>(true);

  useEffect(() => {
    const response = localStorage.getItem("loginData");
    (async () => {
      if (response !== null) {
        const data = JSON.parse(response);
        if (data.driverStep === 1) {
          createDriver();
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    const response = localStorage.getItem("loginData");
    if (response !== null && calendarDate) {
      const data = JSON.parse(response);
      const day = (calendarDate as Date).getDate();
      const operationItem = payPage ? payItem : incomeItem;
      const operationPrice = payPage ? -parseInt(price) : parseInt(price);
      const setData = {
        [day]: arrayUnion({
          id: uuidv4(),
          item: operationItem[0],
          imageKey: operationItem[1],
          note: itemNote,
          price: operationPrice,
          location: location,
        }),
      };
      await setFireStore("users", data.id, setData, calendarDate);
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

  const handlePrice = (price: string) => {
    if (price[0] === "-" || price[0] === "+") {
      setIsPriceValid(false);
      setPriceHint("請輸入數字");
    } else if (!price) {
      setPrice("");
      setIsPriceValid(false);
      setPriceHint("請填寫金額");
    } else if (!Number(price)) {
      setIsPriceValid(false);
      setPriceHint("請輸入數字");
    } else if (price.length < 10) {
      setPrice(price);
      setIsPriceValid(true);
    } else {
      setIsPriceValid(false);
      setPriceHint("最多9位數");
    }
  };

  const handleNote = (note: string) => {
    if (note.length < 100) {
      setIsNoteValid(true);
      setItemNote(note);
    } else {
      setIsNoteValid(false);
    }
  };

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
      <div className="manualDriver" onClick={() => createDriver()}>
        <img src="images/manual.png" alt="manual" />
        <p>新手教學</p>
      </div>
      <div className={create.gridContainer}>
        <Link to="/" className={create.back}>
          <i className="fa-solid fa-chevron-left"></i>
        </Link>
        <Calendar
          onChange={setCalendarDate}
          value={calendarDate}
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
        <form className={create.formCard} onSubmit={handleSubmit}>
          <div className={create.inputGroup}>
            <div className={create.inputItem} id="itemResult">
              <p>項目</p>
              <p>：</p>
              <img
                src={
                  payPage ? `images/${payItem[0]}.png` : `images/${incomeItem[0]}.png`
                }
                alt={payPage ? payItem[0] : incomeItem[0]}
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
                      setIsPriceValid(true);
                    }}
                  >
                    清空
                  </span>
                )}
                {isPriceValid || <p>{priceHint}</p>}
              </div>
            </div>
            <div className={create.inputFormat}>
              <label htmlFor="note">備註</label>
              <p>&emsp;</p>
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
                      setIsNoteValid(true);
                    }}
                  >
                    清空
                  </span>
                )}
                {isNoteValid || <p>字數達上限</p>}
              </div>
            </div>
            <div className={create.inputFormat}>
              <label htmlFor="location">地區</label>
              <p>&emsp;</p>
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
                {location && <span onClick={() => setLocation("")}>清空</span>}
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
