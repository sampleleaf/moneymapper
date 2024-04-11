import header from "@/css/Header.module.css";

// const year = [{'January':[]},{},{},{},{},{},{},{},{},{},{},{}]

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
      <a href="/"><div className={header.title}>MoneyMapper</div></a>
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
