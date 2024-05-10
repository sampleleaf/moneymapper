import yearMonth from "@/css/YearMonth.module.css";
import { useState } from "react";

const YearMonth: React.FC<{
  years: number;
  setYears: Function;
  months: number;
  setMonths: Function;
}> = ({ years, setYears, months, setMonths }) => {
  const [isDropdown, setIsDropdown] = useState<boolean>(false);
  const defaultMonth = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  return (
    <div className={yearMonth.filtergridArea}>
      <div className={yearMonth.header}>
        <div
          className={yearMonth.dropdownTitle}
          onClick={() => setIsDropdown(!isDropdown)}
        >
          <div>
            {years}年{months}月
          </div>
          <div
            className={yearMonth.dropdown}
            style={isDropdown ? { transform: "rotate(180deg)" } : {}}
          >
            <i className="fa-solid fa-caret-up"></i>
          </div>
        </div>
      </div>
      <div className={yearMonth.space}></div>
      <div
        onClick={() => setIsDropdown(!isDropdown)}
        className={isDropdown ? yearMonth.dropdownLayout : yearMonth.noLayout}
      ></div>
      <div
        className={yearMonth.dropdownList}
        style={isDropdown ? { transform: "translateY(0)" } : {}}
      >
        <div className={yearMonth.selectYear}>
          <div className={yearMonth.tenYear} onClick={() => setYears((prev: number) => prev - 10)}>
            <i className="fa-solid fa-backward"></i>
          </div>
          <div onClick={() => setYears((prev: number) => prev - 1)}>
            <i className="fa-solid fa-caret-left"></i>
          </div>
          <p>{years}</p>
          <div onClick={() => setYears((prev: number) => prev + 1)}>
            <i className="fa-solid fa-caret-right"></i>
          </div>
          <div className={yearMonth.tenYear} onClick={() => setYears((prev: number) => prev + 10)}>
            <i className="fa-solid fa-forward"></i>
          </div>
        </div>
        <div className={yearMonth.selectMonth}>
          {defaultMonth.map((month) => (
            <div
              onClick={() => setMonths(month)}
              key={month}
              className={`${
                months === month ? yearMonth.highlightedMonth : ""
              }`}
            >
              <p>{month}月</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default YearMonth;
