import "@/App.css";
import Header from "@/components/Header";
import Login from "@/pages/Login";
import Home from "@/pages/Home";
import Create from "@/pages/Create";
import Details from "@/pages/Details";
import Pay from "@/components/DetailGroup/Pay";
import Income from "@/components/DetailGroup/Income";
import Remainder from "@/components/DetailGroup/Remainder";
import { useState } from "react";
import { Route, Routes } from "react-router-dom";

const App: React.FC = () => {
  const [login, setLogin] = useState<string | null>(
    localStorage.getItem("loginData")
  );

  const [detailsTranslateX, setDetailsTranslateX] = useState("")
  const [detailsHighlighted, setDetailsHighlighted] = useState("")

  return (
    <>
      {login ? (
        <>
          <Header setLogin={setLogin} setDetailsTranslateX={setDetailsTranslateX} setDetailsHighlighted={setDetailsHighlighted} />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="create" element={<Create />} />
            <Route path="details" element={<Details detailsTranslateX={detailsTranslateX} setDetailsTranslateX={setDetailsTranslateX} detailsHighlighted={detailsHighlighted} setDetailsHighlighted={setDetailsHighlighted} />} >
              <Route path="pay" element={<Pay />} />
              <Route path="income" element={<Income />} />
              <Route path="remainder" element={<Remainder />} />
            </Route>
          </Routes>
        </>
      ) : (
        <Login setLogin={setLogin} />
      )}
    </>
  );
};

export default App;
