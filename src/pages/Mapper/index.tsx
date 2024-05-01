import Map from "@/components/Map";
import home from "@/css/Home.module.css";
import { useState, useEffect } from "react";
import { db } from "@/utils/firebase";
import { doc, getDoc } from "firebase/firestore";
import Switch from "react-switch";
import mapper from "@/css/Mapper.module.css";

const Mapper = () => {
  const [autoMap, setAutoMap] = useState<boolean>(true);
  const [loadingLocation, setLoadingLocation] = useState<boolean>(false);
  const [mapResult, setMapResult] = useState<string | undefined>("");
  const [mapError, setMapError] = useState<string | undefined>("");
  const [years, setYears] = useState<number>(new Date().getFullYear());
  const [months, setMonths] = useState<number>(new Date().getMonth() + 1);
  const [isDropdown, setIsDropdown] = useState<boolean>(false);
  const [payCategories, setPayCategories] = useState<string[]>([]);
  const [priceOfPayCategories, setPriceOfPayCategories] = useState<{
    [key: string]: number[];
  }>({});
  const [incomeCategories, setIncomeCategories] = useState<string[]>([]);
  const [priceOfIncomeCategories, setPriceOfIncomeCategories] = useState<{
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

  const handleDropDown = () => {
    setIsDropdown(!isDropdown);
  };

  const handleChange = (nextChecked: boolean) => {
    setAutoMap(nextChecked);
  };

  return (
    <>
      <div className={home.filtergridArea}>
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
              <div
                onClick={() => setMonths(month)}
                key={month}
                className={`${months === month ? home.highlightedMonth : ""}`}
              >
                <p>{month}月</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className={mapper.space}></div>
      <div className={mapper.selectMap}>
        <div
          className={`${mapper.autoButton} ${autoMap ? mapper.autoMapOn : ""}`}
        >
          自動偵測
        </div>
        <Switch onChange={handleChange} checked={autoMap} />
      </div>
      <div className={mapper.layout}>
        <div className={mapper.description}>
          {autoMap ? (
            <div>
              點選地圖會顯示<b style={{ color: "orangered" }}>目前地區</b>
              的平均收支
            </div>
          ) : (
            <div>
              點選地圖會顯示<b style={{ color: "orange" }}>所選地區</b>
              的平均收支
            </div>
          )}
        </div>
        <div
          className={mapper.mapGridArea}
          style={isDropdown ? { position: "relative", zIndex: 2 } : {}}
        >
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
                    <div className={mapper.scopeTitle} style={{backgroundColor: "rgb(253,201,83)"}}>平均每次支出</div>
                    {payCategories.map((category) => (
                      <div key={category} className={mapper.category}>
                        <div className={mapper.iconAndItem}>
                          <img src={`${category}.png`} alt={`${category}`} />
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
                    <div className={mapper.scopeTitle} style={{backgroundColor: "rgb(158,225,255)"}}>平均每次收入</div>
                    {incomeCategories.map((category) => (
                      <div key={category} className={mapper.category}>
                        <div className={mapper.iconAndItem}>
                          <img src={`${category}.png`} alt={`${category}`} />
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
              <img src="write.png" alt="write" />
              <div className={mapper.remind}>
                <p>{mapResult}</p>
                <p>
                  {years}年{months}月無支出記錄
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
      </div>
    </>
  );
};

export default Mapper;
