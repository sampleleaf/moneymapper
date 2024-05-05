import { Chart } from "react-google-charts";
import { useEffect, useState } from "react";
import { useOutletContext, Link } from "react-router-dom";
import { db } from "@/utils/firebase";
import { doc, getDoc } from "firebase/firestore";
import RemainderNote from "../DetailNote/RemainderNote";
import detailGroup from "@/css/DetailGroup.module.css";
import { driver } from "driver.js";

type ContextType = { years: number; months: number };

interface Item {
  id: string;
  item: string;
  note: string;
  price: number;
  location: string;
}

const Remainder: React.FC<{ setPayPage: Function }> = ({ setPayPage }) => {
  const { years, months } = useOutletContext<ContextType>();
  const [googleData, setGoogleData] = useState<(string | number)[][]>([]);
  const [isPop, setIsPop] = useState<boolean>(false);
  const [popDate, setPopDate] = useState<string | number>("");

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

  const handlePopDetail = (date: string | number) => {
    setPopDate(date);
    setIsPop(true);
  };

  const handleCloseDetail = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPopDate("");
    setIsPop(false);
  };

  const googleChartData = [["日期", "收入", "支出", "結餘"], ...googleData];

  const googleChartOptions = {
    // title: "Company Performance",
    curveType: "function",
    legend: { position: "bottom" },
    series: {
      0: { color: "rgb(71, 184, 224)" },
      1: { color: "rgb(254, 116, 113)" },
      2: { color: "rgb(211, 132, 240)" },
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

  const driverObj = driver({
    showProgress: true,
    steps: [
      {
        element: "#list",
        popover: {
          title: googleData.length > 0 ? "結餘詳情" : "教學",
          description:
            googleData.length > 0
              ? "點選項目可以看到當日明細"
              : "先記一筆帳才有後續教學喔!",
          side: "top",
          align: "center",
        },
      },
      // More steps...
    ],
  });

  return (
    <>
      <div className="manualDriver" onClick={() => driverObj.drive()}>
        <img src="../manual.png" alt="manual" />
        <p>新手教學</p>
      </div>
      {googleData.length > 0 ? (
        <>
          <div className={detailGroup.chartGridArea}>
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
          </div>
          <ul className={detailGroup.list} id="list">
            <li>
              <p>日結餘</p>
            </li>
            {googleData.map((data) => (
              <li
                key={data[0]}
                onClick={() => handlePopDetail(data[0])}
                className={detailGroup.remainderHover}
              >
                {isPop && popDate === data[0] && (
                  <div
                    className={detailGroup.noteBackground}
                    onClick={(e) => handleCloseDetail(e)}
                  >
                    <div
                      className={detailGroup.noteTitle}
                      style={{ backgroundColor: "rgb(218, 173, 235)" }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div
                        className={detailGroup.cross}
                        onClick={(e) => handleCloseDetail(e)}
                      >
                        <i className="fa-solid fa-xmark"></i>
                      </div>
                      <p>{data[0]}</p>
                    </div>
                    <div
                      className={detailGroup.noteDescribe}
                      onClick={(e) => e.stopPropagation()}
                    >
                      結餘詳情
                    </div>
                    <div
                      className={detailGroup.noteCard}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <RemainderNote
                        years={years}
                        months={months}
                        date={data[0]}
                      />
                    </div>
                  </div>
                )}
                <div className={detailGroup.item}>
                  <p>{data[0]}</p>
                </div>
                <p>${data[3]}</p>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <>
          <div className={detailGroup.emptyLineChart}>
            <img src="../emptylinechart.png" alt="emptylinechart" />
          </div>
          <div className={detailGroup.unSelected}>
            <img src="../write.png" alt="write" />
            <div className={detailGroup.remind}>
              <p>
                {years}年{months}月無記帳記錄
              </p>
            </div>
            <Link
              onClick={() => setPayPage(true)}
              className={detailGroup.addItem}
              to="/create"
            >
              記一筆
            </Link>
          </div>
        </>
      )}
    </>
  );
};

export default Remainder;
