import home from "@/css/Home.module.css";
import DayItem from "@/components/DayItem";
import { useEffect, useState } from "react";
import { db } from "@/utils/firebase";
import { doc, getDoc, updateDoc, arrayRemove } from "firebase/firestore";

const Home: React.FC = () => {
  const [days, setDays] = useState<string[]>([]);

  useEffect(() => {
    const response = localStorage.getItem("loginData");
    if (response !== null) {
      const data = JSON.parse(response);
      (async () => {
        const docRef = doc(db, "users", data.id, "2024", "4");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          // console.log(Object.keys(docSnap.data()));
          setDays(Object.keys(docSnap.data()));
        } else {
          // docSnap.data() will be undefined in this case
          console.log("No such document!");
        }
      })();
    }
  }, []);

  return (
    <>
      <div className={home.container}>
        <div className={home.header}>2024年4月</div>
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
          {days && days.map((day) => <DayItem key={day} day={day} />)}
          <a className={home.addItem} href="./create">
            <i className="fa-solid fa-circle-xmark"></i>
          </a>
        </div>
      </div>
    </>
  );
};

export default Home;
