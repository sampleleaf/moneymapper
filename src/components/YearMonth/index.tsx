import { useState } from "react";

import PopCalendar from "@/components/PopCalendar";
import yearMonth from "@/css/YearMonth.module.css";
import images from "@/utils/images";
import { useDate } from "@/utils/zustand";

const YearMonth: React.FC = () => {
  const { years, setPlusYear, setMinusYear, months, setMonths } = useDate();

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
            <div className={yearMonth.tenYear} onClick={() => setMinusYear(10)}>
              <i className="fa-solid fa-backward"></i>
            </div>
            <div onClick={() => setMinusYear(1)}>
              <i className="fa-solid fa-caret-left"></i>
            </div>
            <p>{years}</p>
            <div onClick={() => setPlusYear(1)}>
              <i className="fa-solid fa-caret-right"></i>
            </div>
            <div className={yearMonth.tenYear} onClick={() => setPlusYear(10)}>
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
