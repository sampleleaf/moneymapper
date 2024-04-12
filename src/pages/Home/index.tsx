import home from "@/css/Home.module.css";
import DayItem from "@/components/DayItem";
import { useEffect, useState } from "react";
import { db } from "@/utils/firebase";
import { doc, getDoc, updateDoc, arrayRemove } from "firebase/firestore";

const Home: React.FC = () => {
  const [years, setYears] = useState<number>(new Date().getFullYear());
  const [months, setMonths] = useState<number>(new Date().getMonth() + 1);
  const [days, setDays] = useState<string[]>([]);
  const [isDropdown, setIsDropdown] = useState<boolean>(false);
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
          setDays(Object.keys(docSnap.data()));
        } else {
          // docSnap.data() will be undefined in this case
          setDays([]);
          console.log("No such document!");
        }
      })();
    }
  }, [months, years]);

  const handleDropDown = () => {
    setIsDropdown(!isDropdown);
  };

  return (
    <>
      <div className={home.container}>
        <div className={home.header}>
          <div className={home.dropdownTitle} onClick={handleDropDown}>
            <div>
              {years}年{months}月
            </div>
            <div className={isDropdown ? home.closeList : home.dropdown}>
              <i className="fa-solid fa-caret-up"></i>
            </div>
          </div>
          {isDropdown ? (
            <div className={home.dropdownList}>
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
                    {month}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            ""
          )}
        </div>
        <div className={home.analyze}>
          <div>
            <p>月支出</p>
            {/* <p>${pay && pay.reduce((acc, cur) => acc + cur.price, 0) || 0}</p> */}
          </div>
          <div>
            <p>月收入</p>
            <p>$99999</p>
          </div>
        </div>
        <div className={home.echart}>
          <div className={home.remainderSpace}></div>
          <div className={home.monthRemainder}>
            <p>月結餘</p>
            <p>$999999</p>
          </div>
        </div>
        <div className={home.itemsByDayThisMonth}>
          {Object.keys(days).length > 0 ? (
            days.map((day) => (
              <DayItem key={day} day={day} months={months} years={years} />
            ))
          ) : (
            <p>無記帳記錄</p>
          )}
          <a className={home.addItem} href="./create">
            <i className="fa-solid fa-circle-xmark"></i>
          </a>
        </div>
      </div>
    </>
  );
};

export default Home;
