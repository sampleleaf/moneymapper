import home from "@/css/Home.module.css";
import DayItem from "@/components/DayItem";
import YearMonth from "@/components/YearMonth";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { db } from "@/utils/firebase";
import { doc, getDoc } from "firebase/firestore";
import { Chart } from "react-google-charts";

const Home: React.FC<{
  years: number;
  setYears: Function;
  months: number;
  setMonths: Function;
}> = ({ years, setYears, months, setMonths }) => {
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
    if (response !== null) {
      const data = JSON.parse(response);
      (async () => {
        const yearString = years.toString();
        const monthString = months.toString();
        const docRef = doc(db, "users", data.id, yearString, monthString);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          // console.log(Object.keys(docSnap.data()));
          const dayLength = Object.keys(docSnap.data()).length;
          const items = [];
          for (let i = 0; i < dayLength; i++) {
            items.push(...docSnap.data()[Object.keys(docSnap.data())[i]]);
          }
          // console.log(Object.keys(items).length);
          // console.log(items);
          setAllItemsOfMonth(items);
          setDays(Object.keys(docSnap.data()).reverse());
        } else {
          // docSnap.data() will be undefined in this case
          setAllItemsOfMonth([]);
          setDays([]);
          console.log("No such document!");
        }
      })();
    }
  }, [months, years, itemRemoved]);

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
      <Link className={home.addItem} to="/create">
        <i className="fa-solid fa-plus"></i>
      </Link>
      <div className={home.container}>
        <YearMonth
          years={years}
          setYears={setYears}
          months={months}
          setMonths={setMonths}
        />
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
        <div className={home.itemsByDayThisMonth}>
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
              <img src="write.png" alt="write" />
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
