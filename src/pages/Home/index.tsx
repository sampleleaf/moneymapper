import home from "@/css/Home.module.css";
import DayItem from "@/components/DayItem";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { db } from "@/utils/firebase";
import { doc, getDoc } from "firebase/firestore";
import { Chart } from "react-google-charts";

const Home: React.FC = () => {
  const [years, setYears] = useState<number>(new Date().getFullYear());
  const [months, setMonths] = useState<number>(new Date().getMonth() + 1);
  const [days, setDays] = useState<string[]>([]);
  const [isDropdown, setIsDropdown] = useState<boolean>(false);
  const [allItemsOfMonth, setAllItemsOfMonth] = useState<
    { price: number; item: string; id: string }[]
  >([]);
  const [itemRemoved, setItemRemoved] = useState<boolean>(false);
  const [popEdit, setPopEdit] = useState<boolean>(false);
  const [remindDelete, setRemindDelete] = useState<boolean>(false);
  const defaultMonth = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

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
          console.log(items);
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

  const handleDropDown = () => {
    setIsDropdown(!isDropdown);
  };

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
      1: { color: "rgb(253,201,83)" },
    },
    chartArea: { top: "5%", width: "90%", height: "90%" },
  };

  return (
    <>
      <Link className={home.addItem} to="/create">
        <i className="fa-solid fa-plus"></i>
      </Link>
      <div className={home.container}>
        <div
          className={home.header}
          style={
            popEdit ? { zIndex: "-1" } : remindDelete ? { zIndex: "-1" } : {}
          }
        >
          <div className={home.dropdownTitle} onClick={handleDropDown}>
            <div>
              {years}年{months}月
            </div>
            <div
              className={home.dropdown}
              style={isDropdown ? { transform: "rotate(180deg)" } : {}}
            >
              <i className="fa-solid fa-caret-up"></i>
            </div>
          </div>
        </div>
        <div className={home.space}></div>
        <div
          onClick={handleDropDown}
          className={isDropdown ? home.dropdownLayout : ""}
        ></div>
        <div
          className={home.dropdownList}
          style={
            isDropdown
              ? { transform: "translateY(0)" }
              : popEdit
              ? { zIndex: "-2" }
              : remindDelete
              ? { zIndex: "-2" }
              : {}
          }
        >
          <div className={home.selectYear}>
            <div onClick={() => setYears((prev) => prev - 1)}>
              <i className="fa-solid fa-caret-left"></i>
            </div>
            <p>{years}</p>
            <div onClick={() => setYears((prev) => prev + 1)}>
              <i className="fa-solid fa-caret-right"></i>
            </div>
          </div>
          <div className={home.selectMonth}>
            {defaultMonth.map((month) => (
              <div onClick={() => setMonths(month)} key={month}>
                {month}月
              </div>
            ))}
          </div>
        </div>
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
                <p>{years}年{months}月無記帳記錄</p>
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
