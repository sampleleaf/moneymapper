import { Chart } from "react-google-charts";
import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { db } from "@/utils/firebase";
import { doc, getDoc } from "firebase/firestore";
import detailGroup from "@/css/DetailGroup.module.css";

type ContextType = { years: number; months: number };

interface Item {
  id: string;
  item: string;
  note: string;
  price: number;
  location: string;
}

const Remainder = () => {
  const { years, months } = useOutletContext<ContextType>();
  const [googleData, setGoogleData] = useState<(string | number)[][]>([]);

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
          // console.log(docSnap.data());
          // console.log(Object.keys(docSnap.data()));
          const dayLength = Object.keys(docSnap.data()).length;
          const googleArray = [];
          for (let i = 0; i < dayLength; i++) {
            const items = docSnap.data()[Object.keys(docSnap.data())[i]];
            const totalPayOfDay = items.reduce((acc: number, cur: Item) => {
              if (cur.price < 0) {
                return acc + Math.abs(cur.price);
              } else {
                return acc;
              }
            }, 0);
            const totalIncomeOfDay = items.reduce((acc: number, cur: Item) => {
              if (cur.price > 0) {
                return acc + cur.price;
              } else {
                return acc;
              }
            }, 0);
            const remainOfDay = totalIncomeOfDay - totalPayOfDay;
            // console.log(totalPayEachDay, totalIncomeEachDay)
            googleArray.push([
              `${months}月${Object.keys(docSnap.data())[i]}日`,
              totalIncomeOfDay,
              totalPayOfDay,
              remainOfDay,
            ]);
            // console.log(docSnap.data()[Object.keys(docSnap.data())[i]])
          }
          // console.log(googleArray);
          setGoogleData(googleArray);
        } else {
          // docSnap.data() will be undefined in this case
          setGoogleData([]);
          console.log("No such document!");
        }
      })();
    }
  }, [years, months]);

  const googleChartData = [["日期", "收入", "支出", "結餘"], ...googleData];

  const googleChartOptions = {
    // title: "Company Performance",
    curveType: "function",
    legend: { position: "bottom" },
    series: {
      0: { color: "rgb(71,184,224)" },
      1: { color: "rgb(253,201,83)" },
      2: { color: "rgb(254,116,113)" },
    },

    tooltip: { trigger: "focus" },
    focusTarget: "category",
    pointSize: "5",
    crosshair: {
      trigger: "focus",
      focused: { color: "black" },
      orientation: "vertical",
    },
  };

  return (
    <>
      {googleData.length > 0 ? (
        <div>
          <div
            className={`${detailGroup.googleChart} ${detailGroup.lineChart}`}
          >
            <Chart
              chartType="LineChart"
              width="100%"
              height="273px"
              data={googleChartData}
              options={googleChartOptions}
            />
          </div>
          <ul className={detailGroup.list}>
            <li>
              <p>日結餘</p>
            </li>
            {googleData.map((data) => (
              <li key={data[0]}>
                <div className={detailGroup.item}>
                  <p>{data[0]}</p>
                </div>
                <p>${data[3]}</p>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className={detailGroup.unSelected}>
          <img src="../write.png" alt="write" />
          <div className={detailGroup.remind}>
            <p>
              {years}年{months}月無記帳記錄
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default Remainder;
