import { Chart } from "react-google-charts";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { db } from "@/utils/firebase";
import { doc, getDoc } from "firebase/firestore";
import RemainderNote from "../DetailNote/RemainderNote";
import detailGroup from "@/css/DetailGroup.module.css";
import { detailDriver } from "@/utils/driver";
import { useDate } from "@/utils/zustand";
import { useFinance } from "@/utils/zustand";
import { Item } from "@/interfaces";

const Remainder: React.FC = () => {
  const {years, months, onChange} = useDate()
  const {setPayPage} = useFinance()

  const [googleData, setGoogleData] = useState<(string | number)[][]>([]);
  const [isPop, setIsPop] = useState<boolean>(false);
  const [popDate, setPopDate] = useState<string | number>("");
  const [isReverse, setIsReverse] = useState<boolean>(true);
  const [reverseData, setReverseData] = useState<(string | number)[][]>([]);

  useEffect(() => {
    const response = localStorage.getItem("loginData");
    if (response !== null) {
      const data = JSON.parse(response);
      (async () => {
        const docRef = doc(db, "users", data.id, `${years}`, `${months}`);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
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
            googleArray.push([
              `${months}月${Object.keys(docSnap.data())[i]}日`,
              totalIncomeOfDay,
              totalPayOfDay,
              remainOfDay,
            ]);
          }
          const reversedArray = [...googleArray].reverse();
          setGoogleData(googleArray);
          setReverseData(reversedArray);
        } else {
          // if docSnap.data() not exists
          setGoogleData([]);
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

  return (
    <>
      <div
        className="manualDriver"
        onClick={() =>
          detailDriver(googleData, "結餘詳情", "當日", "帳").drive()
        }
      >
        <img src="../images/manual.png" alt="manual" />
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
            <li className={detailGroup.reverse}>
              <p>日結餘</p>
              <img
                src="../images/reverse.png"
                alt="reverse"
                onClick={() => setIsReverse(!isReverse)}
              />
            </li>
            {(isReverse ? reverseData : googleData).map((data) => (
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
            <img src="../images/emptylinechart.png" alt="emptylinechart" />
          </div>
          <div className={detailGroup.unSelected}>
            <img src="../images/write.png" alt="write" />
            <div className={detailGroup.remind}>
              <p>
                {years}年{months}月無記帳記錄
              </p>
            </div>
            <Link
              onClick={() => {
                setPayPage(true);
                onChange(
                  new Date(`${years}-${months}-${new Date().getDate()}`)
                );
              }}
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
