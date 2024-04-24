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
    setDetailsTranslateX("translateX(-102.5%)");
    setDetailsHighlighted("yellow");
    setSidebar(!sidebar);
  };

  const handleDetailIncome = () => {
    setDetailsTranslateX("translateX(0)");
    setDetailsHighlighted("aqua");
    setSidebar(!sidebar);
  };

  const handleDetailRemainder = () => {
    setDetailsTranslateX("translateX(102.5%)");
    setDetailsHighlighted("lightCoral");
    setSidebar(!sidebar);
  };

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
            <div className={header.cross} onClick={() => setSidebar(false)}>
              <i className="fa-solid fa-xmark"></i>
            </div>
            <h3 className={header.username}>
              Hello, {loginData && JSON.parse(loginData).name}
            </h3>
            <div className={header.sidebarContainer}>
              <Link onClick={handleDetailPay} to="details/pay">
                <div>
                  <img src="pay.png" alt="pay" />
                  <p>支出</p>
                </div>
              </Link>
              <Link onClick={handleDetailIncome} to="details/income">
                <div>
                  <img src="income.png" alt="income" />
                  <p>收入</p>
                </div>
              </Link>
              <Link onClick={handleDetailRemainder} to="details/remainder">
                <div>
                  <img src="remainder.png" alt="remainder" />
                  <p>支出</p>
                </div>
              </Link>
              <Link to="mapper">
                <div>
                  <img src="map.png" alt="map" />
                  <p>地區收支</p>
                </div>
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
          <Link to="/mapper">
            <i className="fa-solid fa-map-location-dot"></i>
          </Link>
          <p onClick={handleLogout} className={header.logout}>
            登出
          </p>
        </div>
      </div>
      <div className={header.space}></div>
    </>
  );
};

export default Header;
