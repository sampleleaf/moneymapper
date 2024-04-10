import "@/App.css";
import Header from "@/components/Header";
import Login from "@/pages/Login";
import { useState } from "react";

const App: React.FC = () => {
  const [login, setLogin] = useState<string | null>(localStorage.getItem("loginData"));
  // const isLogin = localStorage.getItem("loginData");
  console.log(login);

  return <>{login ? <Header /> : <Login setLogin={setLogin} />}</>;
}

export default App;
