import login from "@/css/Login.module.css";
import { useState } from "react";
import { toast } from "react-toastify";
import { db } from "@/utils/firebase";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, setDoc, collection, getDoc } from "firebase/firestore";

const Login: React.FC<{ setLogin: Function }> = ({ setLogin }) => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [newUser, setNewUser] = useState<boolean>(false);

  const handleNewUser = (e: React.MouseEvent) => {
    e.preventDefault();
    setNewUser(!newUser);
  };

  const handleSignUp = (e: React.MouseEvent) => {
    e.preventDefault();
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
        });
        setNewUser(!newUser);
        toast.success(<span>註冊成功 <br /> 您可以登入了</span>, {
          theme: "dark",
          position: "top-center",
        });
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode);
        console.log(errorMessage);
        toast.error(<span>註冊失敗 <br /> {errorCode}</span>, {
          theme: "dark",
          position: "top-center"
        });
      });
  };

  const handleSignIn = (e: React.MouseEvent) => {
    e.preventDefault();
    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        const { user } = userCredential;
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          // console.log("Document data:", docSnap.data());
          localStorage.setItem("loginData", JSON.stringify(docSnap.data()));
          setLogin(localStorage.getItem("loginData"));
        } else {
          console.log("No such document!");
        }
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode);
        console.log(errorMessage);
        toast.error(<span>登入失敗 <br /> {errorCode}</span>, {
          theme: "dark",
          position: "top-center"
        });
      });
  };

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
          <div className={login.styleInput}>
            <input
              id="email"
              type="email"
              placeholder="請輸入信箱"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <div>
              <i className="fa-solid fa-envelope"></i>
            </div>
          </div>
          <div className={login.styleInput}>
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
          </div>
          {newUser ? (
            <div className={login.styleInput}>
              <input
                id="username"
                type="text"
                placeholder="請輸入使用者名稱"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <div>
                <i className="fa-solid fa-circle-user"></i>
              </div>
            </div>
          ) : (
            <div className={login.signIn}>
              <button onClick={handleSignIn}>登入</button>
            </div>
          )}
          {newUser ? (
            <>
              <div className={login.signIn}>
                <button onClick={handleNewUser}>返回登入</button>
              </div>
              <div className={login.signUp}>
                <button onClick={handleSignUp}>註冊</button>
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
    </>
  );
};

export default Login;
