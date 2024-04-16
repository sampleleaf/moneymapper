import header from "@/css/Header.module.css";
import { useState } from "react";
import { Link } from "react-router-dom";

const Header: React.FC<{
  setLogin: Function;
  setDetailsTranslateX: Function;
  setDetailsHighlighted: Function;
}> = ({ setLogin, setDetailsTranslateX, setDetailsHighlighted }) => {
  const [sidebar, setSidebar] = useState<boolean>(false);

  const loginData = localStorage.getItem("loginData");

  const handleLogout = () => {
    localStorage.removeItem("loginData");
    setLogin(localStorage.getItem("loginData"));
  };

  const handleSidebar = () => {
    setSidebar(!sidebar);
  };

  const handleDetailPay = () => {
    setDetailsTranslateX("translateX(-102.5%)")
    setDetailsHighlighted("yellow")
  }

  const handleDetailIncome = () => {
    setDetailsTranslateX("translateX(0)")
    setDetailsHighlighted("aqua")
  }

  const handleDetailRemainder = () => {
    setDetailsTranslateX("translateX(102.5%)")
    setDetailsHighlighted("lightCoral")
  }

  return (
    <>
      <div
        onClick={handleSidebar}
        className={header.sidebarBackground}
        style={
          sidebar
            ? { backgroundColor: "rgba(0, 0, 0, 0.5)", pointerEvents: "auto" }
            : {}
        }
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className={header.sidebar}
          style={sidebar ? { transform: "translateX(0)" } : {}}
        >
          <div className={header.sidebarLayout}>
            <h3 className={header.username}>
              Hello, {loginData && JSON.parse(loginData).name}
            </h3>
            <div className={header.sidebarContainer}>
              <Link
                onClick={handleDetailPay}
                to="details/pay"
              >
                支出
              </Link>
              <Link
                onClick={handleDetailIncome}
                to="details/income"
              >
                收入
              </Link>
              <Link
                onClick={handleDetailRemainder}
                to="details/remainder"
              >
                結餘
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className={header.container}>
        <div onClick={handleSidebar} className={header.bar}>
          <i className="fa-solid fa-bars"></i>
        </div>
        <Link to="/">
          <div className={header.title}>MoneyMapper</div>
        </Link>
        <div className={header.iconContainer}>
          <i className="fa-solid fa-map-location-dot"></i>
          <p onClick={handleLogout} className={header.logout}>
            登出
          </p>
        </div>
      </div>
    </>
  );
};

export default Header;
