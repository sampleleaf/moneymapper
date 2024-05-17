import details from "@/css/Details.module.css";
import YearMonth from "@/components/YearMonth";
import { Link, Outlet } from "react-router-dom";
import { useDetailBar } from "@/utils/zustand";

const Details: React.FC = () => {
  const {detailsTranslateX, setDetailsTranslateX, detailsHighlighted, setDetailsHighlighted} = useDetailBar()

  const handleDetailBar = (translateX: string, color: string) => {
    setDetailsTranslateX(translateX)
    setDetailsHighlighted(color)
  }

  return (
    <div className={details.layout}>
      <YearMonth />
      <div className={details.navbarLayout}>
        <div
          className={details.triggerLink}
          style={{
            transform: detailsTranslateX,
            backgroundColor: detailsHighlighted,
          }}
        ></div>
        <div className={details.navbarContainer}>
          <Link onClick={() => handleDetailBar("translateX(-102.5%)", "rgb(255, 193, 190)")} to="pay">
            支出
          </Link>
          <Link onClick={() => handleDetailBar("translateX(0)", "rgb(158, 225, 255)")} to="income">
            收入
          </Link>
          <Link onClick={() => handleDetailBar("translateX(102.5%)", "rgb(218, 173, 235)")} to="remainder">
            結餘
          </Link>
        </div>
      </div>
      <div className={details.space}></div>
      <Outlet />
    </div>
  );
};

export default Details;
