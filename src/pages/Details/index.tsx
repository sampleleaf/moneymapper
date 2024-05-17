import details from "@/css/Details.module.css";
import YearMonth from "@/components/YearMonth";
import { Link, Outlet } from "react-router-dom";

const Details: React.FC<{
  detailsTranslateX: string;
  setDetailsTranslateX: React.Dispatch<React.SetStateAction<string>>;
  detailsHighlighted: string;
  setDetailsHighlighted: React.Dispatch<React.SetStateAction<string>>;
}> = ({
  detailsTranslateX,
  setDetailsTranslateX,
  detailsHighlighted,
  setDetailsHighlighted,
}) => {

  const handleDetailPay = () => {
    setDetailsTranslateX("translateX(-102.5%)");
    setDetailsHighlighted("rgb(255, 193, 190)");
  };

  const handleDetailIncome = () => {
    setDetailsTranslateX("translateX(0)");
    setDetailsHighlighted("rgb(158, 225, 255)");
  };

  const handleDetailRemainder = () => {
    setDetailsTranslateX("translateX(102.5%)");
    setDetailsHighlighted("rgb(218, 173, 235)");
  };

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
          <Link onClick={handleDetailPay} to="pay">
            支出
          </Link>
          <Link onClick={handleDetailIncome} to="income">
            收入
          </Link>
          <Link onClick={handleDetailRemainder} to="remainder">
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
