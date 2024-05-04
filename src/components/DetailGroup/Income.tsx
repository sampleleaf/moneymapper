import { Chart } from "react-google-charts";
import { useEffect, useState } from "react";
import { useOutletContext, Link } from "react-router-dom";
import { db } from "@/utils/firebase";
import { doc, getDoc } from "firebase/firestore";
import detailGroup from "@/css/DetailGroup.module.css";
import IncomeNote from "@/components/DetailNote/IncomeNote";

type ContextType = { years: number; months: number };

const Income = () => {
  const { years, months } = useOutletContext<ContextType>();
  const [googleData, setGoogleData] = useState<(string | number)[][]>([]);
  const [isPop, setIsPop] = useState<boolean>(false);
  const [popItem, setPopItem] = useState<string | number>("");
  const [days, setDays] = useState<string[]>([]);

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
          setDays(Object.keys(docSnap.data()).reverse());
          const dayLength = Object.keys(docSnap.data()).length;
          const items = [];
          for (let i = 0; i < dayLength; i++) {
            items.push(...docSnap.data()[Object.keys(docSnap.data())[i]]);
          }
          // console.log(items)
          /*item category*/
          const itemTotals: { [key: string]: number } = {};
          items.forEach((item) => {
            const itemName = item.item;
            const price = item.price;
            if (price > 0) {
              if (itemName in itemTotals) {
                itemTotals[itemName] += Math.abs(price);
              } else {
                itemTotals[itemName] = Math.abs(price);
              }
            }
          });
          /*refactor for google charts*/
          const itemLength = Object.keys(itemTotals).length;
          const googleChartArray = [];
          for (let i = 0; i < itemLength; i++) {
            googleChartArray.push([
              Object.keys(itemTotals)[i],
              itemTotals[Object.keys(itemTotals)[i]],
            ]);
          }
          // console.log(itemTotals);
          // console.log(Object.keys(itemTotals))
          // console.log(googleChartArray);
          setGoogleData(googleChartArray);
        } else {
          // docSnap.data() will be undefined in this case
          setGoogleData([]);
          console.log("No such document!");
        }
      })();
    }
  }, [years, months]);

  const totalPay =
    googleData &&
    googleData.reduce((acc, cur) => {
      return acc + Number(cur[1]);
    }, 0);

  const googleChartData = [["Major", "Degrees"], ["empty", 0], ...googleData];

  const googleChartOptions = {
    pieHole: 0.5,
    is3D: false,
    legend: "bottom",
    chartArea: { top: "10%", width: "80%", height: "80%" },
    slices: {
      1: { color: "rgb(71,184,224)" },
      2: { color: "rgb(253,201,83)" },
    },
  };

  const handlePopDetail = (item: string | number) => {
    setPopItem(item);
    setIsPop(true);
  };

  const handleCloseDetail = (e: React.MouseEvent) => {
    e.stopPropagation()
    setPopItem("");
    setIsPop(false);
  }

  return (
    <>
      <div className={detailGroup.chartGridArea}>
        <div className={detailGroup.googleChart}>
          <Chart
            chartType="PieChart"
            width="100%"
            height="273px"
            data={googleChartData}
            options={googleChartOptions}
          />
          {googleData.length < 1 && (
            <div className={detailGroup.emptyDonut}></div>
          )}
          <div className={detailGroup.total}>
            <p>總收入</p>
            <p>${totalPay}</p>
          </div>
        </div>
      </div>
      {googleData.length > 0 ? (
        <ul className={detailGroup.list}>
          <li>
            <p>項目收入</p>
          </li>
          {googleData.map((data) => (
            <li key={data[0]} onClick={() => handlePopDetail(data[0])} className={detailGroup.incomeHover}>
              {isPop && popItem === data[0] && (
                <div className={detailGroup.noteBackground} onClick={(e) => handleCloseDetail(e)}>
                  <div className={detailGroup.noteTitle} style={{backgroundColor: "rgb(158,225,255)"}}>
                    <div className={detailGroup.cross} onClick={(e) => handleCloseDetail(e)}><i className="fa-solid fa-xmark"></i></div>
                    <img src={`../${popItem}.png`} alt={`${popItem}`} />
                    <p>{popItem}</p>
                  </div>
                  <div className={detailGroup.noteDescribe}>支出明細</div>
                  <div className={detailGroup.noteCard} onClick={(e) => e.stopPropagation()}>
                    {days.map((day) => (
                      <IncomeNote
                        key={day}
                        popItem={popItem}
                        total={data[1]}
                        day={day}
                        months={months}
                        years={years}
                      />
                    ))}
                  </div>
                </div>
              )}
              <div className={detailGroup.item}>
                <img src={`../${data[0]}.png`} alt={`${data[0]}`} />
                <p>{data[0]}</p>
              </div>
              <p>${data[1]}</p>
            </li>
          ))}
        </ul>
      ) : (
        <div className={detailGroup.unSelected}>
          <img src="../write.png" alt="write" />
          <div className={detailGroup.remind}>
            <p>
              {years}年{months}月無收入記錄
            </p>
          </div>
          <Link className={detailGroup.addItem} to="/create">記一筆</Link>
        </div>
      )}
    </>
  );
};

export default Income;
