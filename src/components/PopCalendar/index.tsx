import { db } from "@/utils/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useState, useContext, useEffect } from "react";
import { DateContext } from "@/context/dateContext";
import Calendar from "react-calendar";
import popCalendar from "@/css/PopCalendar.module.css";
import { Link } from "react-router-dom";

interface DateContextType {
  years: number;
  months: number;
  value: Value;
  onChange: React.Dispatch<React.SetStateAction<Value>>;
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

const PopCalendar = () => {
  const { years, months, value, onChange } = useContext(DateContext) as DateContextType;
  const [calendarMark, setCalendarMark] = useState<Date[] | null>(null);
  const [dayItems, setDayItems] = useState<Item[] | null>(null)

  useEffect(() => {
    if(value){
      handleCalendarChange(new Date(`${years}-${months}-${date}`))
    }
  },[])

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
          setDayItems(docSnap.data()[selectday])
        }
      })();
    }
  }, [value])

  const customDates: Date[] | null = calendarMark;

  const tileClassName: (args: {date: Date;}) => string | string[] | undefined = ({ date }) => {
    const customDateString = customDates && customDates.map((d) => d.toDateString());
    if (customDateString && customDateString.includes(date.toDateString())) {
      return "dot";
    }
    return "";
  };

  const handleCalendarChange = (newDate: Date | null) => {
    // When the month changes, set the date to the first day of that month
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
            (day) => new Date(newDate.getFullYear(), newDate.getMonth(), Number(day))
          );
          console.log(forCustomDates);
          setCalendarMark(forCustomDates);
          //switch Calendar view
          onChange(new Date(newDate.getFullYear(), newDate.getMonth(), Number(selectday)));
          //display item of selectday
          // console.log(docSnap.data()[selectday]);
          // setDayItems(docSnap.data()[selectday])
        } else {
          //switch Calendar view
          onChange(new Date(newDate.getFullYear(), newDate.getMonth(), Number(selectday)));
          //if selectday no items
          // setDayItems(null)
        }
      })();
    }
  };

  const dayPay = dayItems ? dayItems.reduce((acc, cur) => {
    if(cur.price < 0){
      return acc + cur.price
    }else{
      return acc
    }
  }, 0) : 0

  const dayIncome = dayItems ? dayItems.reduce((acc, cur) => {
    if(cur.price > 0){
      return acc + cur.price
    }else{
      return acc
    }
  }, 0) : 0

  const dayRemainder = dayPay + dayIncome

  return (
    <div
      className={popCalendar.calendarContainer}
      onClick={(e) => e.stopPropagation()}
    >
      <Calendar
        onChange={onChange}
        value={value}
        className="calendarDriver"
        tileClassName={tileClassName}
        onActiveStartDateChange={({ activeStartDate }) => handleCalendarChange(activeStartDate)}
      />
      <div className={popCalendar.calculate}>
        <div>
          <p>支出：</p>
          <p>${Math.abs(dayPay)}</p>
        </div>
        <div>
          <p>收入：</p>
          <p>${dayIncome}</p>
        </div><div>
          <p>結餘：</p>
          <p>${dayRemainder}</p>
        </div>
      </div>
      <div className={popCalendar.overflow}>
        {dayItems && dayItems.map(item => (
          <div className={popCalendar.itemContainer} key={item.id}>
            <div className={popCalendar.imageAndNote}>
              <img src={`${item.item}.png`} alt={item.item} />
              <p>{item.note || item.item}</p>
            </div>
            <div>${item.price}</div>
          </div>
        ))}
      </div>
      <Link
        // onClick={() => setPayPage(true)}
        className={popCalendar.addItem}
        to="/create"
      >
        <i className="fa-solid fa-plus"></i>
      </Link>
    </div>
  );
};

export default PopCalendar;
