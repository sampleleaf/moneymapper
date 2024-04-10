import login from "@/css/Login.module.css";

const Login: React.FC = () => {
  return (
    <>
      <div className={login.background}></div>
      <div className={login.container}>
        <div className={login.title}>
          <p>Money</p>
          <p>Mapper</p>
        </div>
        <div className={login.slogan}>
          <p>掌握每筆消費</p>
          <p>洞察生活足跡</p>
        </div>
        <form className={login.form}>
          <div className={login.inputContainer}>
            <label htmlFor="email">
              <i className="fa-solid fa-envelope"></i>
            </label>
            <input id="email" type="email" />
          </div>
          <div className={login.inputContainer}>
            <label htmlFor="password">
              <i className="fa-solid fa-lock"></i>
            </label>
            <input id="password" type="password" />
          </div>
          <div className={login.signIn}>
            <button>登入</button>
          </div>
          <div className={login.signUp}>
            <button>註冊</button>
          </div>
        </form>
      </div>
    </>
  );
};

export default Login;
