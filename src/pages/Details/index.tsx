import details from "@/css/Details.module.css";
import { Link, Outlet } from "react-router-dom";
import home from "@/css/Home.module.css";
import { useState } from "react";

type ContextType = { years: number; months: number };

const Details: React.FC<{
  detailsTranslateX: string;
  setDetailsTranslateX: Function;
  detailsHighlighted: string;
  setDetailsHighlighted: Function;
}> = ({ detailsTranslateX, setDetailsTranslateX, detailsHighlighted, setDetailsHighlighted }) => {
  const [years, setYears] = useState<number>(new Date().getFullYear());
  const [months, setMonths] = useState<number>(new Date().getMonth() + 1);
  const [isDropdown, setIsDropdown] = useState<boolean>(false);
  const defaultMonth = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  const handleDropDown = () => {
    setIsDropdown(!isDropdown);
  };

  const handleDetailPay = () => {
    setDetailsTranslateX("translateX(-102.5%)");
    setDetailsHighlighted("yellow");
  };

  const handleDetailIncome = () => {
    setDetailsTranslateX("translateX(0)");
    setDetailsHighlighted("aqua");
  };

  const handleDetailRemainder = () => {
    setDetailsTranslateX("translateX(102.5%)");
    setDetailsHighlighted("rgb(254,116,113)");
  };

  return (
    <>
      <Link to=".." className={details.back}>
        <i className="fa-solid fa-chevron-left"></i>
      </Link>
      <div className={details.navbarLayout}>
        <div
          className={details.triggerLink}
          style={{ transform: detailsTranslateX, backgroundColor: detailsHighlighted }}
        ></div>
        <div className={details.navbarContainer}>
          <Link
            onClick={handleDetailPay}
            to="pay"
          >
            支出
          </Link>
          <Link
            onClick={handleDetailIncome}
            to="income"
          >
            收入
          </Link>
          <Link
            onClick={handleDetailRemainder}
            to="remainder"
          >
            結餘
          </Link>
        </div>
      </div>
      <div className={details.space}></div>
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
        style={isDropdown ? { transform: "translateY(50px)" } : {}}
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
            <div onClick={() => setMonths(month)} key={month}>
              {month}月
            </div>
          ))}
        </div>
      </div>
      <div className={details.space}></div>
      <Outlet context={{ years, months } satisfies ContextType} />
    </>
  );
};

export default Details;
