import { doc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Chart } from "react-google-charts";
import { Link } from "react-router-dom";

import DayItem from "@/components/DayItem";
import YearMonth from "@/components/YearMonth";
import home from "@/css/Home.module.css";
import { Item } from "@/interfaces";
import { calculateTotals } from "@/utils/calculateTotals";
import { driverStep0, driverStep3, homeDriver } from "@/utils/driver";
import { db } from "@/utils/firebase";
import { getFireStore } from "@/utils/reviseFireStore";
import { useDate, useFinance } from "@/utils/zustand";

const Home: React.FC = () => {
  const { years, months, onChange } = useDate();
  const { setPayPage } = useFinance();

  const [days, setDays] = useState<string[]>([]);
  const [allItemsOfMonth, setAllItemsOfMonth] = useState<Item[]>([]);
  const [itemRemoved, setItemRemoved] = useState<boolean>(false);
  const [popEdit, setPopEdit] = useState<boolean>(false);
  const [remindDelete, setRemindDelete] = useState<boolean>(false);
  const [popId, setPopId] = useState<string>("");

  useEffect(() => {
    const response = localStorage.getItem("loginData");
    if (response !== null && years) {
      const data = JSON.parse(response);
      (async () => {
        const itemsOfMonth = await getFireStore("users", data.id, years, months);
        const daysOfMonth = Object.keys(itemsOfMonth);
        const dayLength = daysOfMonth.length;
        const allItems = [];
        for (let i = 0; i < dayLength; i++) {
          const dayOfMonth: string = daysOfMonth[i];
          allItems.push(...itemsOfMonth[dayOfMonth]);
        }
        setAllItemsOfMonth(allItems);
        setDays(daysOfMonth.reverse());
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

  const { totalOfPay, totalOfIncome } = calculateTotals(allItemsOfMonth);

  const monthRemainder = totalOfPay + totalOfIncome;

  const googleChartData = [
    ["Major", "Degrees"],
    ["收入", totalOfIncome],
    ["支出", Math.abs(totalOfPay)],
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
              <p>${Math.abs(totalOfPay)}</p>
            </div>
            <div>
              <p>月收入</p>
              <p>${totalOfIncome}</p>
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
