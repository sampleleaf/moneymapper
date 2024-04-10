import header from "@/css/Header.module.css";

const Header: React.FC<{ setLogin: Function }> = ({ setLogin }) => {
  const handleLogout = () => {
    localStorage.removeItem("loginData");
    setLogin(localStorage.getItem("loginData"));
  };

  return (
    <div className={header.container}>
      <div className={header.bar}>
        <i className="fa-solid fa-bars"></i>
      </div>
      <div className={header.title}>MoneyMapper</div>
      <div className={header.iconContainer}>
        <i className="fa-solid fa-map-location-dot"></i>
        <p onClick={handleLogout} className={header.logout}>
          登出
        </p>
      </div>
    </div>
  );
};

export default Header;
