import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import { Link } from "react-router-dom";

import popCalendar from "@/css/PopCalendar.module.css";
import { Images, Item } from "@/interfaces";
import { calculateTotals } from "@/utils/calculateTotals";
import images from "@/utils/images";
import { getFireStore } from "@/utils/reviseFireStore";
import { useDate, useFinance } from "@/utils/zustand";

const imagesObj = images as Images;

const PopCalendar: React.FC<{
  setIsPopCalender: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ setIsPopCalender }) => {
  const { setPayPage } = useFinance();
  const { years, months, value, onChange } = useDate();
  const [timeStampOfMonth, setTimeStampOfMonth] = useState<string[] | null>(
    null
  );
  const [dayItems, setDayItems] = useState<Item[] | null>(null);

  useEffect(() => {
    if (value) {
      handleCalendarChange(
        new Date(`${years}-${months}-${(value as Date).getDate()}`)
      );
    }
  }, []);

  useEffect(() => {
    const response = localStorage.getItem("loginData");
    if (response !== null && value) {
      const data = JSON.parse(response);
      (async () => {
        const year = (value as Date).getFullYear();
        const month = (value as Date).getMonth() + 1;
        const selectday = (value as Date).getDate();
        const itemsOfMonth = await getFireStore("users", data.id, year, month);
        setDayItems(itemsOfMonth[selectday]);
      })();
    }
  }, [value]);

  const handleCalendarChange = (activeStartDate: Date | null) => {
    const response = localStorage.getItem("loginData");
    if (response !== null && value && activeStartDate) {
      const data = JSON.parse(response);
      (async () => {
        //activeStartDate return year month which we view on the Calendar
        const year = activeStartDate.getFullYear();
        const month = activeStartDate.getMonth() + 1;
        //default day of activeStartDate is first day, so I pass the day by value
        const selectday = (value as Date).getDate();
        const itemsOfMonth = await getFireStore("users", data.id, year, month);
        const daysOfMonth = Object.keys(itemsOfMonth);
        const timeStampOfAccountedDays = daysOfMonth.map((day) =>
          new Date(year, month - 1, Number(day)).toDateString()
        );
        setTimeStampOfMonth(timeStampOfAccountedDays);
        //change value
        onChange(new Date(`${year}-${month}-${Number(selectday)}`));
      })();
    }
  };

  const tileClassName = ({ date }: { date: Date }) => {
    if (timeStampOfMonth?.includes(date.toDateString())) {
      return "dot";
    }
  };

  const { totalOfPay, totalOfIncome } = calculateTotals(dayItems);

  const dayRemainder = totalOfPay + totalOfIncome;

  return (
    <div
      className={popCalendar.calendarContainer}
      onClick={(e) => e.stopPropagation()}
    >
      <div
        className={popCalendar.previous}
        onClick={() => setIsPopCalender(false)}
      >
        <i className="fa-solid fa-chevron-left"></i>
      </div>
      <div
        className={popCalendar.cross}
        onClick={() => setIsPopCalender(false)}
      >
        <i className="fa-solid fa-xmark"></i>
      </div>
      <Calendar
        onChange={onChange}
        value={value}
        className="calendarDriver"
        tileClassName={tileClassName}
        onActiveStartDateChange={({ activeStartDate }) =>
          //when calendar view change, trigger function below
          handleCalendarChange(activeStartDate)
        }
      />
      <div className={popCalendar.calculate}>
        <div>
          <p>支出：</p>
          <p>${Math.abs(totalOfPay)}</p>
        </div>
        <div>
          <p>收入：</p>
          <p>${totalOfIncome}</p>
        </div>
        <div>
          <p>結餘：</p>
          <p>${dayRemainder}</p>
        </div>
      </div>
      <div className={popCalendar.layout}>
        {dayItems && dayItems.length > 0 ? (
          dayItems.map((item) => (
            <div className={popCalendar.itemContainer} key={item.id}>
              <div className={popCalendar.imageAndNote}>
                <img src={imagesObj[item.imageKey]} alt={item.item} />
                <p>{item.note || item.item}</p>
              </div>
              <div>${item.price}</div>
            </div>
          ))
        ) : (
          <div className={popCalendar.unSelected}>
            <img src={imagesObj.write} alt="write" />
            <div className={popCalendar.remind}>
              <p>
                {(value as Date).getFullYear()}年
                {(value as Date).getMonth() + 1}月{(value as Date).getDate()}日
                無記帳記錄
              </p>
            </div>
            <p>點選下方按鈕記帳</p>
          </div>
        )}
      </div>
      <Link
        onClick={() => setPayPage(true)}
        className={popCalendar.addItem}
        to="/create"
      >
        <i className="fa-solid fa-plus"></i>
      </Link>
    </div>
  );
};

export default PopCalendar;
