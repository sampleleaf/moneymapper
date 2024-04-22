import Map from "@/components/Map";
import mapper from "@/css/Mapper.module.css";
import home from "@/css/Home.module.css";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { db } from "@/utils/firebase";
import { doc, getDoc } from "firebase/firestore";

const Mapper = () => {
  const [autoMap, setAutoMap] = useState<boolean>(true);
  const [loadingLocation, setLoadingLocation] = useState<boolean>(false);
  const [mapResult, setMapResult] = useState<string | undefined>("");
  const [mapError, setMapError] = useState<string | undefined>("");
  const [years, setYears] = useState<number>(new Date().getFullYear());
  const [months, setMonths] = useState<number>(new Date().getMonth() + 1);
  const [isDropdown, setIsDropdown] = useState<boolean>(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [priceOfCategories, setPriceOfCategories] = useState<{
    [key: string]: number[];
  }>({});
  const defaultMonth = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

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
          /*item category*/
          const allItemsOfSameLocation = allItems.filter((item) => {
            return item.location === mapResult;
          });
          // console.log(allItemsOfSameLocation);
          const itemCategories: { [key: string]: number[] } = {};
          allItemsOfSameLocation.forEach((item) => {
            if (item.item in itemCategories) {
              itemCategories[item.item].push(item.price);
            } else {
              itemCategories[item.item] = [item.price];
            }
          });
          // console.log(itemCategories);
          // console.log(Object.keys(itemCategories));
          setPriceOfCategories(itemCategories);
          setCategories(Object.keys(itemCategories));
        } else {
          // docSnap.data() will be undefined in this case
          setCategories([]);
          setPriceOfCategories({});
          console.log("No such document!");
        }
      })();
    }
  }, [years, months, mapResult]);

  const handleDropDown = () => {
    setIsDropdown(!isDropdown);
  };

  return (
    <>
      <Link to=".." className={mapper.back}>
        <i className="fa-solid fa-chevron-left"></i>
      </Link>
      <div className={home.header}>
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
      <div
        onClick={handleDropDown}
        className={isDropdown ? home.dropdownLayout : ""}
      ></div>
      <div
        className={home.dropdownList}
        style={isDropdown ? { transform: "translateY(0)" } : {}}
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
      <div className={mapper.header}>
        <div
          className={mapper.triggerPage}
          style={
            autoMap
              ? { backgroundColor: "yellow" }
              : { transform: "translateX(100%)", backgroundColor: "aqua" }
          }
        ></div>
        <div className={mapper.choose}>
          <div onClick={() => setAutoMap(true)}>自動</div>
          <span className={mapper.vertical}></span>
          <div onClick={() => setAutoMap(false)}>手動</div>
        </div>
      </div>
      <p className={mapper.description}>點選地圖會顯示標記所在地區的平均消費</p>
      <div style={isDropdown ? { position: "relative", zIndex: 2 } : {}}>
        <Map
          autoMap={autoMap}
          setLoadingLocation={setLoadingLocation}
          setMapResult={setMapResult}
          setMapError={setMapError}
        />
      </div>
      {loadingLocation ? (
        <div className={mapper.unSelected}>
          <img src="loading.gif" alt="loading" />
        </div>
      ) : mapResult ? (
        Object.keys(categories).length > 0 ? (
          <div>
            <p className={mapper.subTitle}>
              {mapResult}
              {years}年{months}月
            </p>
            <div className={mapper.container}>
              <div>
                <p>平均每次支出</p>
                {priceOfCategories &&
                  categories.map(
                    (category) =>
                      priceOfCategories[category][0] < 0 && (
                        <div key={category}>
                          <b>{category}</b>$
                          {priceOfCategories[category].reduce(
                            (acc, cur) =>
                              Math.round(
                                acc +
                                  Math.abs(cur) /
                                    priceOfCategories[category].length
                              ),
                            0
                          )}
                        </div>
                      )
                  )}
              </div>
              <div>
                <p>平均每次收入</p>
                {priceOfCategories &&
                  categories.map(
                    (category) =>
                      priceOfCategories[category][0] > 0 && (
                        <div key={category}>
                          <b>{category}</b>$
                          {priceOfCategories[category].reduce(
                            (acc, cur) =>
                              Math.round(
                                acc +
                                  Math.abs(cur) /
                                    priceOfCategories[category].length
                              ),
                            0
                          )}
                        </div>
                      )
                  )}
              </div>
            </div>
          </div>
        ) : (
          <div className={mapper.unSelected}>
            <img src="write.png" alt="write" />
            <div className={mapper.remind}>
              <p>{mapResult}</p>
              <p>
                {years}年{months}月無記帳記錄
              </p>
            </div>
          </div>
        )
      ) : (
        <div className={mapper.unSelected}>
          <img src="mapMarker.png" alt="mapMarker" />
          <p className={mapper.remind}>
            {mapError ? "請選擇陸地或國家領海" : "您尚未選擇地點"}
          </p>
        </div>
      )}
    </>
  );
};

export default Mapper;
