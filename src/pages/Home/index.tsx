import home from "@/css/Home.module.css";
import { db } from "@/utils/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";

const Home: React.FC = () => {
  const [items, setItems] = useState<
    {
      id: string;
      item: string;
      price: number;
    }[]
  >([]);

  useEffect(() => {
    const response = localStorage.getItem("loginData");
    if (response !== null) {
      const data = JSON.parse(response);
      (async () => {
        const docRef = doc(db, "users", data.id, "2024", "4");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          console.log("Document data:", docSnap.data()[11]);
          setItems(docSnap.data()[11]);
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
          <div>
            <div className={home.dateAndRemainder}>
              <div className={home.date}>
                <p>2024年4月11日</p>
              </div>
              <p className={home.dayRemainder}>${items && items.reduce((acc, cur) => acc + cur.price, 0)}</p>
            </div>
            <div className={home.line}></div>
            <div className={home.itemsByDay}>
              {items &&
                items.map((item) => (
                  <div className={home.items}>
                    <div className={home.item}>
                      <p>{item.item}</p>
                    </div>
                    <p>${item.price}</p>
                  </div>
                ))}
            </div>
          </div>
          <div>
            <div className={home.dateAndRemainder}>
              <div className={home.date}>
                <p>2024年12月28日</p>
                <p>星期幾</p>
              </div>
              <p className={home.dayRemainder}>$-48</p>
            </div>
            <div className={home.line}></div>
            <div className={home.itemsByDay}>
              <div className={home.items}>
                <div className={home.item}>
                  <p>圖</p>
                  <p>圖標預設名稱或自訂備註</p>
                </div>
                <p>$-199999</p>
              </div>
              <div className={home.items}>
                <div className={home.item}>
                  <p>圖</p>
                  <p>圖標預設名稱或自訂備註</p>
                </div>
                <p>$-199999</p>
              </div>
            </div>
          </div>
          <a className={home.addItem} href="./create">
            <i className="fa-solid fa-circle-xmark"></i>
          </a>
        </div>
      </div>
    </>
  );
};

export default Home;
