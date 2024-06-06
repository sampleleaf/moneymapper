import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { collection, doc, getDoc, setDoc } from "firebase/firestore";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { RefObject, useRef, useState } from "react";
import { toast } from "react-toastify";

import Loader from "@/components/Loader";
import { db } from "@/utils/firebase";
import { useGSAP } from "@gsap/react";

import login from "./Login.module.css";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const Login: React.FC<{
  setLogin: React.Dispatch<React.SetStateAction<string | null>>;
}> = ({ setLogin }) => {
  const [email, setEmail] = useState<string>("test@gmail.com");
  const [password, setPassword] = useState<string>("111111");
  const [username, setUsername] = useState<string>("");
  const [newUser, setNewUser] = useState<boolean>(false);
  const [isSignUp, setIsSignUp] = useState<boolean>(false);
  const [isSignIn, setIsSignIn] = useState<boolean>(false);
  const [isSubmit, setIsSubmit] = useState<boolean>(false);
  const [isValidEmail, setIsValidEmail] = useState(true);
  const [usernameLimit, setUsernameLimit] = useState<boolean>(false);

  const middles: RefObject<HTMLDivElement>[] = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
  ];

  const backToTop: RefObject<HTMLAnchorElement> = useRef(null);

  useGSAP(() => {
    middles.forEach((middle) => {
      gsap.to(middle.current, {
        scrollTrigger: {
          trigger: middle.current,
          start: "center bottom",
          toggleActions: "restart resume resume reverse",
        },
        x: 0,
        opacity: 1,
        duration: 0.7,
        delay: 0.3,
      });
    });

    gsap.to(backToTop.current, {
      scrollTrigger: {
        trigger: backToTop.current,
        start: "top bottom",
        toggleActions: "restart resume resume reset",
      },
      y: 0,
      opacity: 1,
      duration: 1,
    });
  });

  const handleNewUser = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsSubmit(false);
    setNewUser(!newUser);
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmit(true);
    setIsSignUp(true);
    const auth = getAuth();
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed up
        const { user } = userCredential;
        const userCollection = collection(db, "users");
        const userDoc = doc(userCollection, user.uid as string);
        setDoc(userDoc, {
          email: user.email,
          id: user.uid,
          name: username,
          driverStep: 0,
        });
        setNewUser(!newUser);
        setIsSignUp(false);
        toast.success(
          <span>
            註冊成功 <br /> 您可以登入了
          </span>,
          {
            position: "top-center",
          }
        );
      })
      .catch((error) => {
        const errorCode = error.code;
        setIsSignUp(false);
        toast.error(
          <span>
            註冊失敗 <br /> {errorCode}
          </span>,
          {
            position: "top-center",
          }
        );
      });
  };

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSignIn(true);
    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        const { user } = userCredential;
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          localStorage.setItem("loginData", JSON.stringify(docSnap.data()));
          setIsSignIn(false);
          setLogin(localStorage.getItem("loginData"));
        } else {
          console.log("No such document!");
        }
      })
      .catch((error) => {
        const errorCode = error.code;
        setIsSignIn(false);
        toast.error(
          <span>
            登入失敗 <br /> {errorCode}
          </span>,
          {
            position: "top-center",
          }
        );
      });
  };

  const validateEmail = (input: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setIsValidEmail(regex.test(input));
  };

  const handleUsername = (username: string) => {
    if (username.length <= 20) {
      setUsernameLimit(false);
      setUsername(username);
    } else {
      setUsernameLimit(true);
    }
  };

  return (
    <>
      <div className={login.background}></div>
      <div className={login.fakeBackground}>
        <a className={login.scrollDown} href="#next">
          <p>查看簡介</p>
          <i className="fa-solid fa-angles-down"></i>
        </a>
      </div>
      <div className={login.container}>
        <div className={login.paper}>
          <div className={login.title}>
            <p>Money</p>
            <p>Mapper</p>
          </div>
          <div className={login.slogan}>
            <p>掌握每筆消費</p>
            <p>洞察生活足跡</p>
          </div>
          <form
            className={login.form}
            onSubmit={newUser ? handleSignUp : handleSignIn}
          >
            <div
              className={`${login.styleInput} ${!newUser && login.focusInput} ${
                newUser && isSubmit
                  ? !isValidEmail
                    ? login.wrongInput
                    : login.correctInput
                  : ""
              }`}
            >
              <label htmlFor="email">信箱</label>
              <input
                id="email"
                type="email"
                placeholder="請輸入信箱"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  validateEmail(e.target.value);
                }}
                required
              />
              <div>
                <i className="fa-solid fa-envelope"></i>
              </div>
              {newUser && isSubmit && !isValidEmail && (
                <p className={login.warning}>請輸入正確格式的email</p>
              )}
            </div>
            <div
              className={`${login.styleInput} ${!newUser && login.focusInput} ${
                newUser && isSubmit
                  ? password.length < 6
                    ? login.wrongInput
                    : login.correctInput
                  : ""
              }`}
            >
              <label htmlFor="password">密碼</label>
              <input
                id="password"
                type="password"
                placeholder="請輸入密碼"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <div>
                <i className="fa-solid fa-lock"></i>
              </div>
              {newUser && isSubmit && password.length < 6 && (
                <p className={login.warning}>密碼至少6碼</p>
              )}
            </div>
            {newUser ? (
              <div
                className={`${login.styleInput} ${
                  isSubmit
                    ? username.length < 1
                      ? login.wrongInput
                      : login.correctInput
                    : ""
                }`}
              >
                <label htmlFor="email">使用者名稱</label>
                <input
                  id="username"
                  type="text"
                  placeholder="請輸入使用者名稱"
                  value={username}
                  onChange={(e) => handleUsername(e.target.value)}
                  required
                />
                <div>
                  <i className="fa-solid fa-circle-user"></i>
                </div>
                {usernameLimit && <p className={login.warning}>字數達上限</p>}
              </div>
            ) : (
              <div className={login.signIn}>
                {isSignIn ? (
                  <button type="button">
                    <div>
                      登入中...
                      <Loader />
                    </div>
                  </button>
                ) : (
                  <button>登入</button>
                )}
              </div>
            )}
            {newUser ? (
              <>
                <div className={login.signIn}>
                  <button onClick={handleNewUser}>返回登入</button>
                </div>
                <div className={login.signUp}>
                  {isSignUp ? (
                    <button type="button">
                      <div>
                        註冊中...
                        <Loader />
                      </div>
                    </button>
                  ) : (
                    <button>註冊</button>
                  )}
                </div>
              </>
            ) : (
              <>
                <div className={login.seperate}>
                  <div></div>
                  <p>OR</p>
                  <div></div>
                </div>
                <div className={login.signUp}>
                  <button onClick={handleNewUser}>我是新使用者</button>
                </div>
              </>
            )}
          </form>
        </div>
      </div>
      <div id="next" className={login.gsap}>
        <div className={login.describe} ref={middles[0]}>
          <div>簡單明瞭的主頁</div>
          <div></div>
          <div>讓你輕鬆了解收支比</div>
        </div>
        <div className={login.picture} ref={middles[1]}>
          <img src="images/mobilehome.png" alt="home" />
          <img src="images/home.png" alt="home" />
        </div>
      </div>
      <div className={`${login.gsap} ${login.seperateColor}`}>
        <div className={login.describe} ref={middles[2]}>
          <div>簡單記帳</div>
          <div></div>
          <div>
            <p>三步即可完成</p>
            <p>點圖示、填金額、按提交</p>
          </div>
        </div>
        <div className={login.picture} ref={middles[3]}>
          <img src="images/mobilecreate.png" alt="create" />
          <img src="images/create.png" alt="create" />
        </div>
      </div>
      <div className={login.gsap}>
        <div className={login.describe} ref={middles[4]}>
          <div>清晰報表</div>
          <div></div>
          <div>讓你掌握收支細節</div>
        </div>
        <div className={login.picture} ref={middles[5]}>
          <img src="images/mobiledetail.png" alt="pay" />
          <img src="images/detail.png" alt="pay" />
        </div>
      </div>
      <div className={`${login.gsap} ${login.seperateColor}`}>
        <div className={login.describe} ref={middles[6]}>
          <div>地區功能</div>
          <div></div>
          <div>
            <p>了解不同地區的項目收支</p>
          </div>
        </div>
        <div className={login.picture} ref={middles[7]}>
          <img src="images/mobilemapper.png" alt="map" />
          <img src="images/mapper.png" alt="map" />
        </div>
      </div>
      <a className={login.backToTop} href="#" ref={backToTop}>
        <p>返回頂部</p>
        <div>
          <i className="fa-solid fa-angles-up"></i>
        </div>
      </a>
    </>
  );
};

export default Login;
