import { Chart } from "react-google-charts";
import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { db } from "@/utils/firebase";
import { doc, getDoc } from "firebase/firestore";
import pay from "@/css/Pay.module.css";

type ContextType = { years: number; months: number };

const Income = () => {
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
          // console.log(Object.keys(docSnap.data()));
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
          console.log(googleChartArray);
          setGoogleData(googleChartArray);
        } else {
          // docSnap.data() will be undefined in this case
          console.log("No such document!");
        }
      })();
    }
  }, [years, months]);

  const totalPay = googleData && googleData.reduce((acc, cur) => {
    return acc + Number(cur[1])
  }, 0)

  const googleChartData = [["Major", "Degrees"], ...googleData];

  const googleChartOptions = {
    pieHole: 0.4,
    is3D: false,
    legend: "bottom",
  };

  return (
    <>
      <div className={pay.googleChart}>
        <Chart
          chartType="PieChart"
          width="100%"
          height="400px"
          data={googleChartData}
          options={googleChartOptions}
        />
        <div className={pay.total}>
          <p>總收入</p>
          <p>${totalPay}</p>
        </div>
      </div>
      <ul className={pay.list}>
        <li>
          <p>消費明細</p>
        </li>
        {googleData.map(data => (
          <li>
            <p>{data[0]}</p>
            <p>${data[1]}</p>
          </li>
        ))}
      </ul>
    </>
  );
};

export default Income;