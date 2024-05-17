import home from "@/css/Home.module.css";
import DayItem from "@/components/DayItem";
import YearMonth from "@/components/YearMonth";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { db } from "@/utils/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { Chart } from "react-google-charts";
import { homeDriver, driverStep0, driverStep3 } from "@/utils/driver";

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

const Home: React.FC<{
  years: number;
  months: number;
  onChange: (value: Value) => void;
  setPayPage: (boolean: boolean) => void;
}> = ({ years, months, onChange, setPayPage }) => {
  const [days, setDays] = useState<string[]>([]);
  const [allItemsOfMonth, setAllItemsOfMonth] = useState<
    { price: number; item: string; id: string }[]
  >([]);
  const [itemRemoved, setItemRemoved] = useState<boolean>(false);
  const [popEdit, setPopEdit] = useState<boolean>(false);
  const [remindDelete, setRemindDelete] = useState<boolean>(false);
  const [popId, setPopId] = useState<string>("");

  useEffect(() => {
    const response = localStorage.getItem("loginData");
    if (response !== null && years) {
      const data = JSON.parse(response);
      (async () => {
        console.log(years)
        const docRef = doc(db, "users", data.id, `${years}`, `${months}`);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const dayLength = Object.keys(docSnap.data()).length;
          const items = [];
          for (let i = 0; i < dayLength; i++) {
            items.push(...docSnap.data()[Object.keys(docSnap.data())[i]]);
          }
          setAllItemsOfMonth(items);
          setDays(Object.keys(docSnap.data()).reverse());
        } else {
          // if docSnap.data() not exists
          setAllItemsOfMonth([]);
          setDays([]);
        }
      })();
    }
  }, [months, years, itemRemoved]);

  useEffect(() => {
    const response = localStorage.getItem("loginData");
    (async () => {
      if (response !== null) {
        const data = JSON.parse(response);
        const docRef = doc(db, "users", data.id);
        if (data.driverStep === 0) {
          driverStep0();
          data.driverStep = 1;
          localStorage.setItem("loginData", JSON.stringify(data));
          await updateDoc(docRef, {
            driverStep: 1,
          });
        } else if (data.driverStep === 3) {
          driverStep3();
          data.driverStep = 4;
          localStorage.setItem("loginData", JSON.stringify(data));
          await updateDoc(docRef, {
            driverStep: 4,
          });
        }
      }
    })();
  }, []);

  const monthPay =
    allItemsOfMonth &&
    allItemsOfMonth.reduce((acc, cur) => {
      if (cur.price < 0) {
        return acc + cur.price;
      } else {
        return acc;
      }
    }, 0);

  const monthIncome =
    allItemsOfMonth &&
    allItemsOfMonth.reduce((acc, cur) => {
      if (cur.price > 0) {
        return acc + cur.price;
      } else {
        return acc;
      }
    }, 0);

  const monthRemainder =
    allItemsOfMonth && allItemsOfMonth.reduce((acc, cur) => acc + cur.price, 0);

  const googleChartData = [
    ["Major", "Degrees"],
    ["收入", monthIncome],
    ["支出", Math.abs(monthPay)],
  ];

  const googleChartOptions = {
    pieHole: 0.5,
    is3D: false,
    legend: "none",
    slices: {
      0: { color: "rgb(71,184,224)" },
      1: { color: "rgb(254,116,113)" },
    },
    chartArea: { top: "5%", width: "90%", height: "90%" },
  };

  return (
    <>
      <div className="manualDriver" onClick={() => homeDriver(days).drive()}>
        <img src="images/manual.png" alt="manual" />
        <p>新手教學</p>
      </div>
      <Link
        onClick={() => {
          setPayPage(true);
          onChange(new Date(`${years}-${months}-${new Date().getDate()}`));
        }}
        className={home.addItem}
        to="/create"
        id="add"
      >
        <i className="fa-solid fa-plus"></i>
      </Link>
      <div className={home.container}>
        <YearMonth />
        <div className={home.chartGridArea}>
          <div className={home.analyze}>
            <div>
              <p>月支出</p>
              <p>${Math.abs(monthPay)}</p>
            </div>
            <div>
              <p>月收入</p>
              <p>${monthIncome}</p>
            </div>
          </div>
          <div className={home.googleChart}>
            <Chart
              chartType="PieChart"
              width="100%"
              height="273px"
              data={googleChartData}
              options={googleChartOptions}
            />
            {allItemsOfMonth.length < 1 && (
              <div className={home.emptyChart}></div>
            )}
            <div className={home.monthRemainder}>
              <p>月結餘</p>
              <p>${monthRemainder}</p>
            </div>
          </div>
        </div>
        <div className={home.itemsByDayThisMonth} id="item">
          {Object.keys(days).length > 0 ? (
            days.map((day) => (
              <DayItem
                key={day}
                day={day}
                months={months}
                years={years}
                itemRemoved={itemRemoved}
                setItemRemoved={setItemRemoved}
                popId={popId}
                setPopId={setPopId}
                popEdit={popEdit}
                setPopEdit={setPopEdit}
                remindDelete={remindDelete}
                setRemindDelete={setRemindDelete}
              />
            ))
          ) : (
            <div className={home.unSelected}>
              <img src="images/write.png" alt="write" />
              <div className={home.remind}>
                <p>
                  {years}年{months}月無記帳記錄
                </p>
              </div>
              <p>點選底部按鈕記帳</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Home;
