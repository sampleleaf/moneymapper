import "@/App.css";
import Header from "@/components/Header";
import Login from "@/pages/Login";
import Home from "@/pages/Home";
import Create from "@/pages/Create";
import { useState } from "react";
import { Route, Routes } from "react-router-dom";

const App: React.FC = () => {
  const [login, setLogin] = useState<string | null>(
    localStorage.getItem("loginData")
  );

  return (
    <>
      {login ? (
        <>
          <Header setLogin={setLogin} />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/create" element={<Create />} />
          </Routes>
        </>
      ) : (
        <Login setLogin={setLogin} />
      )}
    </>
  );
};

export default App;
