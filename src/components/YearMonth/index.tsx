import yearMonth from "@/css/YearMonth.module.css";
import PopCalendar from "../PopCalendar";
import { useState, useContext } from "react";
import { DateContext } from "@/context/dateContext";
import images from "@/utils/images";

interface DateContextType {
  years: number;
  setYears: React.Dispatch<React.SetStateAction<number>>;
  months: number;
  setMonths: React.Dispatch<React.SetStateAction<number>>;
}

const YearMonth: React.FC = () => {
  const { years, setYears, months, setMonths } = useContext(DateContext) as DateContextType;

  const [isDropdown, setIsDropdown] = useState<boolean>(false);
  const [isPopCalendar, setIsPopCalender] = useState<boolean>(false);
  const defaultMonth = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  return (
    <>
      {isPopCalendar && (
        <div
          className={yearMonth.background}
          onClick={() => setIsPopCalender(false)} 
        >
          <PopCalendar setIsPopCalender={setIsPopCalender} />
        </div>
      )}
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
          <div
            className={yearMonth.calendar}
            onClick={() => setIsPopCalender(true)}
          >
            <img src={images.calendar} alt="calendar" />
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
            <div
              className={yearMonth.tenYear}
              onClick={() => setYears((prev: number) => prev - 10)}
            >
              <i className="fa-solid fa-backward"></i>
            </div>
            <div onClick={() => setYears((prev: number) => prev - 1)}>
              <i className="fa-solid fa-caret-left"></i>
            </div>
            <p>{years}</p>
            <div onClick={() => setYears((prev: number) => prev + 1)}>
              <i className="fa-solid fa-caret-right"></i>
            </div>
            <div
              className={yearMonth.tenYear}
              onClick={() => setYears((prev: number) => prev + 10)}
            >
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
    </>
  );
};

export default YearMonth;
