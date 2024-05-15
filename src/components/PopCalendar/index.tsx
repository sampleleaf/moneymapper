import { db } from "@/utils/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useState, useContext, useEffect } from "react";
import { DateContext } from "@/context/dateContext";
import Calendar from "react-calendar";
import popCalendar from "@/css/PopCalendar.module.css";
import { Link } from "react-router-dom";
import images from "@/utils/images";

interface Images {
  [key: string]: string;
}

const imagesObj = images as Images

interface DateContextType {
  years: number;
  months: number;
  value: Value;
  onChange: React.Dispatch<React.SetStateAction<Value>>;
  setPayPage: React.Dispatch<React.SetStateAction<boolean>>;
}

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

interface Item {
  id: string;
  item: string;
  note: string;
  price: number;
  location: string | undefined;
}

const date = new Date().getDate();

const PopCalendar: React.FC<{ setIsPopCalender: Function }> = ({
  setIsPopCalender,
}) => {
  const { years, months, value, onChange, setPayPage } = useContext(
    DateContext
  ) as DateContextType;
  const [calendarMark, setCalendarMark] = useState<Date[] | null>(null);
  const [dayItems, setDayItems] = useState<Item[] | null>(null);

  useEffect(() => {
    if (value) {
      handleCalendarChange(new Date(`${years}-${months}-${date}`));
    }
  }, []);

  useEffect(() => {
    const response = localStorage.getItem("loginData");
    if (response !== null && value) {
      const data = JSON.parse(response);
      (async () => {
        const yearString = (value as Date).getFullYear().toString();
        const monthString = ((value as Date).getMonth() + 1).toString();
        const selectday = (value as Date).getDate();
        const docRef = doc(db, "users", data.id, yearString, monthString);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          // console.log(Object.keys(docSnap.data()))
          console.log(docSnap.data()[selectday]);
          setDayItems(docSnap.data()[selectday]);
        }
      })();
    }
  }, [value]);

  const customDates: Date[] | null = calendarMark;

  const tileClassName: (args: {
    date: Date;
  }) => string | string[] | undefined = ({ date }) => {
    const customDateString =
      customDates && customDates.map((d) => d.toDateString());
    if (customDateString && customDateString.includes(date.toDateString())) {
      return "dot";
    }
    return "";
  };

  const handleCalendarChange = (newDate: Date | null) => {
    const response = localStorage.getItem("loginData");
    if (response !== null && value && newDate) {
      const data = JSON.parse(response);
      (async () => {
        const yearString = newDate.getFullYear().toString();
        const monthString = (newDate.getMonth() + 1).toString();
        const selectday = (value as Date).getDate();
        const docRef = doc(db, "users", data.id, yearString, monthString);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          //mark calendar
          const days = Object.keys(docSnap.data());
          const forCustomDates = days.map(
            (day) =>
              new Date(newDate.getFullYear(), newDate.getMonth(), Number(day))
          );
          console.log(forCustomDates);
          setCalendarMark(forCustomDates);
          //switch Calendar view
          onChange(
            new Date(
              newDate.getFullYear(),
              newDate.getMonth(),
              Number(selectday)
            )
          );
        } else {
          //even docSnap not exists, still switch Calendar view
          onChange(
            new Date(
              newDate.getFullYear(),
              newDate.getMonth(),
              Number(selectday)
            )
          );
        }
      })();
    }
  };

  const dayPay = dayItems
    ? dayItems.reduce((acc, cur) => {
        if (cur.price < 0) {
          return acc + cur.price;
        } else {
          return acc;
        }
      }, 0)
    : 0;

  const dayIncome = dayItems
    ? dayItems.reduce((acc, cur) => {
        if (cur.price > 0) {
          return acc + cur.price;
        } else {
          return acc;
        }
      }, 0)
    : 0;

  const dayRemainder = dayPay + dayIncome;

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
          handleCalendarChange(activeStartDate)
        }
      />
      <div className={popCalendar.calculate}>
        <div>
          <p>支出：</p>
          <p>${Math.abs(dayPay)}</p>
        </div>
        <div>
          <p>收入：</p>
          <p>${dayIncome}</p>
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
                <img src={imagesObj[item.item]} alt={item.item} />
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
                {years}年{months - 1}月{(value as Date).getDate()}日無記帳記錄
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
