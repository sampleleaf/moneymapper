import Map from "@/components/Map";
import YearMonth from "@/components/YearMonth";
import BookLoader from "@/components/BookLoader";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { db } from "@/utils/firebase";
import { doc, getDoc } from "firebase/firestore";
import Switch from "react-switch";
import mapper from "@/css/Mapper.module.css";
import { driver } from "driver.js";

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

const Mapper: React.FC<{
  years: number;
  months: number;
  onChange: React.Dispatch<React.SetStateAction<Value>>;
  setPayPage: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ years, months, onChange, setPayPage }) => {
  const [autoMap, setAutoMap] = useState<boolean>(true);
  const [loadingLocation, setLoadingLocation] = useState<boolean>(false);
  const [mapResult, setMapResult] = useState<string>("");
  const [mapError, setMapError] = useState<string>("");
  const [payCategories, setPayCategories] = useState<string[]>([]);
  const [priceOfPayCategories, setPriceOfPayCategories] = useState<{
    [key: string]: number[];
  }>({});
  const [incomeCategories, setIncomeCategories] = useState<string[]>([]);
  const [priceOfIncomeCategories, setPriceOfIncomeCategories] = useState<{
    [key: string]: number[];
  }>({});

  useEffect(() => {
    const response = localStorage.getItem("loginData");
    if (response !== null && mapResult) {
      const data = JSON.parse(response);
      (async () => {
        const yearString = years.toString();
        const monthString = months.toString();
        const docRef = doc(db, "users", data.id, yearString, monthString);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const dayLength = Object.keys(docSnap.data()).length;
          const allItems = [];
          for (let i = 0; i < dayLength; i++) {
            allItems.push(...docSnap.data()[Object.keys(docSnap.data())[i]]);
          }
          // console.log(allItems);
          //pay category
          const payItemsOfSameLocation = allItems.filter((item) => {
            return item.location === mapResult && item.price < 0;
          });
          const payItemCategories: { [key: string]: number[] } = {};
          payItemsOfSameLocation.forEach((item) => {
            if (item.item in payItemCategories) {
              payItemCategories[item.item].push(item.price);
            } else {
              payItemCategories[item.item] = [item.price];
            }
          });
          setPriceOfPayCategories(payItemCategories);
          setPayCategories(Object.keys(payItemCategories));
          // income category
          const incomeItemsOfSameLocation = allItems.filter((item) => {
            return item.location === mapResult && item.price > 0;
          });
          const incomeItemCategories: { [key: string]: number[] } = {};
          incomeItemsOfSameLocation.forEach((item) => {
            if (item.item in incomeItemCategories) {
              incomeItemCategories[item.item].push(item.price);
            } else {
              incomeItemCategories[item.item] = [item.price];
            }
          });
          setPriceOfIncomeCategories(incomeItemCategories);
          setIncomeCategories(Object.keys(incomeItemCategories));
        } else {
          // docSnap.data() will be undefined in this case
          setPayCategories([]);
          setPriceOfPayCategories({});
          setIncomeCategories([]);
          setPriceOfIncomeCategories({});
          console.log("No such document!");
        }
      })();
    }
  }, [years, months, mapResult]);

  const handleChange = (nextChecked: boolean) => {
    setAutoMap(nextChecked);
  };

  const driverObj = driver({
    showProgress: true,
    steps: [
      {
        element: "#selectMap",
        popover: {
          title: "切換偵測地區的方式",
          description: "自動：點擊地圖會偵測您所在的地區<br>手動：點擊地圖會偵測您選擇的地區",
          side: "bottom",
          align: "center",
        },
      },
      {
        element: "#mapper",
        popover: {
          title: "點地圖",
          description: "點完後就會顯示您的地區平均收支",
          side: "top",
          align: "center",
        },
      },
      {
        popover: {
          title: "貼心提醒",
          description: "記帳時有記錄地區才會顯示喔!",
          align: "center",
        },
      },
      // More steps...
    ],
  });

  return (
    <>
      <div className="manualDriver" onClick={() => driverObj.drive()}>
        <img src="../images/manual.png" alt="manual" />
        <p>新手教學</p>
      </div>
      <YearMonth />
      <div className={mapper.layout}>
        <div className={mapper.selectMap} id="selectMap">
          <div
            className={`${mapper.autoButton} ${
              autoMap ? mapper.autoMapOn : ""
            }`}
          >
            存取您的位置
          </div>
          <Switch onChange={handleChange} checked={autoMap} />
        </div>
        <div className={mapper.description}>
          {autoMap ? (
            <div>
              點擊地圖會顯示<b style={{ color: "orangered" }}>所在地區</b>
              的平均收支
            </div>
          ) : (
            <div>
              點擊地圖會顯示<b style={{ color: "orange" }}>所選地區</b>
              的平均收支
            </div>
          )}
        </div>
        <div className={mapper.mapGridArea} id="mapper">
          <Map
            autoMap={autoMap}
            setLoadingLocation={setLoadingLocation}
            setMapResult={setMapResult}
            setMapError={setMapError}
          />
        </div>
        {loadingLocation ? (
          <div className={mapper.unSelected}>
            <BookLoader />
          </div>
        ) : mapResult ? (
          (Object.keys(payCategories).length ||
            Object.keys(incomeCategories).length) > 0 ? (
            <div className={mapper.listGridArea}>
              <p className={mapper.subTitle}>
                {mapResult}
                {years}年{months}月
              </p>
              <div className={mapper.container}>
                {Object.keys(payCategories).length > 0 && (
                  <div className={mapper.scope}>
                    <div
                      className={mapper.scopeTitle}
                      style={{ backgroundColor: "rgb(255, 193, 190)" }}
                    >
                      平均每次支出
                    </div>
                    {payCategories.map((category) => (
                      <div key={category} className={mapper.category}>
                        <div className={mapper.iconAndItem}>
                          <img src={`images/${category}.png`} alt={`${category}`} />
                          <b>
                            {category}
                            {/* {priceOfPayCategories[category].length}次 */}
                          </b>
                        </div>
                        <p>
                          {`$${priceOfPayCategories[category].reduce(
                            (acc, cur) =>
                              Math.round(
                                acc +
                                  Math.abs(cur) /
                                    priceOfPayCategories[category].length
                              ),
                            0
                          )}`}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
                {Object.keys(incomeCategories).length > 0 && (
                  <div className={mapper.scope}>
                    <div
                      className={mapper.scopeTitle}
                      style={{ backgroundColor: "rgb(158,225,255)" }}
                    >
                      平均每次收入
                    </div>
                    {incomeCategories.map((category) => (
                      <div key={category} className={mapper.category}>
                        <div className={mapper.iconAndItem}>
                          <img src={`images/${category}.png`} alt={`${category}`} />
                          <b>
                            {category}
                            {/* {priceOfIncomeCategories[category].length}次 */}
                          </b>
                        </div>
                        <p>
                          {`$${priceOfIncomeCategories[category].reduce(
                            (acc, cur) =>
                              Math.round(
                                acc +
                                  Math.abs(cur) /
                                    priceOfIncomeCategories[category].length
                              ),
                            0
                          )}`}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className={mapper.unSelected}>
              <img src="images/write.png" alt="write" />
              <div className={mapper.remind}>
                <p>{mapResult}</p>
                <p>
                  {years}年{months}月無收支記錄
                </p>
              </div>
              <Link
                onClick={() => {setPayPage(true); onChange(new Date(`${years}-${months}-${new Date().getDate()}`));}}
                className={mapper.addItem}
                to="/create"
              >
                記一筆
              </Link>
            </div>
          )
        ) : (
          <div className={mapper.unSelected}>
            <img src="images/mapMarker.png" alt="mapMarker" />
            <p className={mapper.remind}>
              {mapError ? "請選擇陸地或國家領海" : "您尚未選擇地點"}
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default Mapper;
