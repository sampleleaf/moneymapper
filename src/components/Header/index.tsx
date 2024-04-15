import header from "@/css/Header.module.css";
import { useState } from "react";

const Header: React.FC<{ setLogin: Function }> = ({ setLogin }) => {
  const [sidebar, setSidebar] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("loginData");
    setLogin(localStorage.getItem("loginData"));
  };

  const handleSidebar = () => {
    setSidebar(!sidebar);
  };

  return (
    <>
      <div
        onClick={handleSidebar}
        className={header.sidebarBackground}
        style={sidebar ? { backgroundColor: 'rgba(0, 0, 0, 0.5)', pointerEvents: "auto" } : {}}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className={header.sidebar}
          style={sidebar ? { transform: "translateX(0)" } : {}}
        ></div>
      </div>
      <div className={header.container}>
        <div onClick={handleSidebar} className={header.bar}>
          <i className="fa-solid fa-bars"></i>
        </div>
        <a href="/">
          <div className={header.title}>MoneyMapper</div>
        </a>
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
