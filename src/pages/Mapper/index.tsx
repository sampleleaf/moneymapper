import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Switch from "react-switch";

import BookLoader from "@/components/BookLoader";
import Map from "@/components/Map";
import YearMonth from "@/components/YearMonth";
import mapper from "@/css/Mapper.module.css";
import { checkPricePositiveAndMapResult } from "@/utils/checkPricePositiveAndMapResult";
import { mapperDriver } from "@/utils/driver";
import { getFireStore } from "@/utils/reviseFireStore";
import { useDate, useFinance } from "@/utils/zustand";

const Mapper: React.FC = () => {
  const { years, months, setCalendarDate } = useDate();
  const { setPayPage } = useFinance();

  const [autoMap, setAutoMap] = useState<boolean>(true);
  const [loadingLocation, setLoadingLocation] = useState<boolean>(false);
  const [mapResult, setMapResult] = useState<string>("");
  const [mapError, setMapError] = useState<string>("");
  const [payCategories, setPayCategories] = useState<string[]>([]);
  const [priceOfPayCategories, setPriceOfPayCategories] = useState<{
    [category: string]: number[];
  }>({});
  const [incomeCategories, setIncomeCategories] = useState<string[]>([]);
  const [priceOfIncomeCategories, setPriceOfIncomeCategories] = useState<{
    [category: string]: number[];
  }>({});

  useEffect(() => {
    const response = localStorage.getItem("loginData");
    if (response !== null && mapResult) {
      const data = JSON.parse(response);
      (async () => {
        const itemsOfMonth = await getFireStore("users", data.id, years, months);
        const dayLength = Object.keys(itemsOfMonth).length;
        const allItems = [];
        for (let i = 0; i < dayLength; i++) {
          const dayOfMonth: string = Object.keys(itemsOfMonth)[i];
          allItems.push(...itemsOfMonth[dayOfMonth]);
        }
        const { eachPayOfCategories, eachIncomeOfCategories } =
          checkPricePositiveAndMapResult(allItems, mapResult);
        setPriceOfPayCategories(eachPayOfCategories);
        setPayCategories(Object.keys(eachPayOfCategories));
        setPriceOfIncomeCategories(eachIncomeOfCategories);
        setIncomeCategories(Object.keys(eachIncomeOfCategories));
      })();
    }
  }, [years, months, mapResult]);

  const handleChange = (nextChecked: boolean) => {
    setAutoMap(nextChecked);
  };

  return (
    <>
      <div className="manualDriver" onClick={() => mapperDriver()}>
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
                          <img
                            src={`images/${category}.png`}
                            alt={`${category}`}
                          />
                          <b>{category}</b>
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
                          <img
                            src={`images/${category}.png`}
                            alt={`${category}`}
                          />
                          <b>{category}</b>
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
                onClick={() => {
                  setPayPage(true);
                  setCalendarDate(
                    new Date(`${years}-${months}-${new Date().getDate()}`)
                  );
                }}
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
