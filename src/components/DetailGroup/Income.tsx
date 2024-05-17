import { Chart } from "react-google-charts";
import { useState } from "react";
import { Link } from "react-router-dom";
import detailGroup from "@/css/DetailGroup.module.css";
import IncomeNote from "@/components/DetailNote/IncomeNote";
import useDetailGroupData from "@/utils/hook/useDetailGroupData";
import { detailDriver } from "@/utils/driver";
import { useDate } from "@/utils/zustand";
import { useFinance } from "@/utils/zustand";

const Income: React.FC = () => {
  const {years, months, onChange} = useDate()
  const {setPayPage} = useFinance()

  const [isPop, setIsPop] = useState<boolean>(false);
  const [popItem, setPopItem] = useState<string | number>("");
  const [isReverse, setIsReverse] = useState<boolean>(true);

  const { googleData, days, reverseDays } = useDetailGroupData(
    years,
    months,
    true
  );

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
    e.stopPropagation();
    setPopItem("");
    setIsPop(false);
  };

  return (
    <>
      <div
        className="manualDriver"
        onClick={() =>
          detailDriver(googleData, "收入明細", "收入", "收入").drive()
        }
      >
        <img src="../images/manual.png" alt="manual" />
        <p>新手教學</p>
      </div>
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
        <ul className={detailGroup.list} id="list">
          <li>
            <p>收入項目</p>
          </li>
          {googleData.map((data) => (
            <li
              key={data[0]}
              onClick={() => handlePopDetail(data[0])}
              className={detailGroup.incomeHover}
            >
              {isPop && popItem === data[0] && (
                <div
                  className={detailGroup.noteBackground}
                  onClick={(e) => handleCloseDetail(e)}
                >
                  <div
                    className={detailGroup.noteTitle}
                    style={{ backgroundColor: "rgb(158,225,255)" }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div
                      className={detailGroup.cross}
                      onClick={(e) => handleCloseDetail(e)}
                    >
                      <i className="fa-solid fa-xmark"></i>
                    </div>
                    <img src={`../images/${popItem}.png`} alt={`${popItem}`} />
                    <p>{popItem}</p>
                  </div>
                  <div
                    className={detailGroup.noteDescribe}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <p>收入明細</p>
                    <img
                      src="../images/reverse.png"
                      alt="reverse"
                      onClick={() => setIsReverse(!isReverse)}
                    />
                  </div>
                  <div
                    className={detailGroup.noteCard}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {(isReverse ? reverseDays : days).map((day) => (
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
                <img src={`../images/${data[0]}.png`} alt={`${data[0]}`} />
                <p>{data[0]}</p>
              </div>
              <p>${data[1]}</p>
            </li>
          ))}
        </ul>
      ) : (
        <div className={detailGroup.unSelected}>
          <img src="../images/write.png" alt="write" />
          <div className={detailGroup.remind}>
            <p>
              {years}年{months}月無收入記錄
            </p>
          </div>
          <Link
            onClick={() => {
              setPayPage(false);
              onChange(new Date(`${years}-${months}-${new Date().getDate()}`));
            }}
            className={detailGroup.addItem}
            to="/create"
          >
            記一筆
          </Link>
        </div>
      )}
    </>
  );
};

export default Income;
