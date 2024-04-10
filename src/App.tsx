import "@/App.css";
import Header from "@/components/Header";
import Login from "@/pages/Login";
import Home from "@/pages/Home";
import { useState } from "react";

const App: React.FC = () => {
  const [login, setLogin] = useState<string | null>(
    localStorage.getItem("loginData")
  );
  
  return (
    <>
      {login ? <Header setLogin={setLogin} /> : <Login setLogin={setLogin} />}
      <Home />
    </>
  );
};

export default App;
