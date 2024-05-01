import header from "@/css/Header.module.css";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Header: React.FC<{
  setLogin: Function;
  setDetailsTranslateX: Function;
  setDetailsHighlighted: Function;
}> = ({ setLogin, setDetailsTranslateX, setDetailsHighlighted }) => {
  const navigate = useNavigate();
  const [sidebar, setSidebar] = useState<boolean>(false);

  const loginData = localStorage.getItem("loginData");

  const handleLogout = () => {
    navigate("/");
    localStorage.removeItem("loginData");
    setLogin(localStorage.getItem("loginData"));
  };

  const handleSidebar = () => {
    setSidebar(!sidebar);
  };

  const handleDetailPay = () => {
    setDetailsTranslateX("translateX(-102.5%)");
    setDetailsHighlighted("rgb(253,201,83)");
    setSidebar(!sidebar);
  };

  const handleDetailIncome = () => {
    setDetailsTranslateX("translateX(0)");
    setDetailsHighlighted("rgb(158,225,255)");
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
              Welcome, {loginData && JSON.parse(loginData).name}
              {/* Menu */}
            </h3>
            <div className={header.sidebarContainer}>
              <Link to="/" onClick={() => setSidebar(!sidebar)}>
                <i className="fa-solid fa-house"></i>
                首頁
              </Link>
              <Link onClick={handleDetailPay} to="details/pay">
                <i className="fa-solid fa-hand-holding-dollar"></i>
                支出
              </Link>
              <Link onClick={handleDetailIncome} to="details/income">
                <i className="fa-solid fa-sack-dollar"></i>
                收入
              </Link>
              <Link onClick={handleDetailRemainder} to="details/remainder">
                <i className="fa-solid fa-chart-line"></i>
                結餘
              </Link>
              <Link to="mapper" onClick={() => setSidebar(!sidebar)}>
                <i className="fa-solid fa-map-location-dot"></i>
                地區收支
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
          {/* <Link to="/mapper">
            <i className="fa-solid fa-map-location-dot"></i>
          </Link> */}
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
