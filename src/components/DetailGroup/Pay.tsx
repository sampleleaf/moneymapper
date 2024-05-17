import { Chart } from "react-google-charts";
import { useState } from "react";
import { useOutletContext, Link } from "react-router-dom";
import detailGroup from "@/css/DetailGroup.module.css";
import PayNote from "@/components/DetailNote/PayNote";
import useDetailGroupData from "@/utils/hook/useDetailGroupData";
import { detailDriver } from "@/utils/driver";

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

type ContextType = { years: number; months: number };

const Pay: React.FC<{
  setPayPage: React.Dispatch<React.SetStateAction<boolean>>;
  onChange: (value: Value) => void;
}> = ({ setPayPage, onChange }) => {
  const { years, months } = useOutletContext<ContextType>();
  const [isPop, setIsPop] = useState<boolean>(false);
  const [popItem, setPopItem] = useState<string | number>("");
  const [isReverse, setIsReverse] = useState<boolean>(true);

  const { googleData, days, reverseDays } = useDetailGroupData(
    years,
    months,
    false
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
          detailDriver(googleData, "支出明細", "支出", "支出").drive()
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
            <p>總支出</p>
            <p>${totalPay}</p>
          </div>
        </div>
      </div>
      {googleData.length > 0 ? (
        <ul className={detailGroup.list} id="list">
          <li>
            <p>支出項目</p>
          </li>
          {googleData.map((data) => (
            <li
              key={data[0]}
              onClick={() => handlePopDetail(data[0])}
              className={detailGroup.payHover}
            >
              {isPop && popItem === data[0] && (
                <div
                  className={detailGroup.noteBackground}
                  onClick={(e) => handleCloseDetail(e)}
                >
                  <div
                    className={detailGroup.noteTitle}
                    style={{ backgroundColor: "rgb(254,156,153)" }}
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
                    <p>支出明細</p>
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
                      <PayNote
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
        <div className={detailGroup.unSelected} id="unSelect">
          <img src="../images/write.png" alt="write" />
          <div className={detailGroup.remind}>
            <p>
              {years}年{months}月無支出記錄
            </p>
          </div>
          <Link
            onClick={() => {
              setPayPage(true);
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

export default Pay;
