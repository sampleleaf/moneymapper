import "@/App.css";
import "@/calendar.css"
import "@/driver.css"
import "@/toastify.css"
import Header from "@/components/Header";
import Login from "@/pages/Login";
import Home from "@/pages/Home";
import Create from "@/pages/Create";
import Details from "@/pages/Details";
import Mapper from "./pages/Mapper";
import Pay from "@/components/DetailGroup/Pay";
import Income from "@/components/DetailGroup/Income";
import Remainder from "@/components/DetailGroup/Remainder";
import { useState, useContext } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import { Zoom } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import "driver.js/dist/driver.css";
import { DateContext } from "@/context/dateContext";

interface DateContextType {
  years: number;
  setYears: React.Dispatch<React.SetStateAction<number>>;
  months: number;
  setMonths: React.Dispatch<React.SetStateAction<number>>;
}

const App: React.FC = () => {
  const [login, setLogin] = useState<string | null>(
    localStorage.getItem("loginData")
  );

  const [detailsTranslateX, setDetailsTranslateX] = useState("")
  const [detailsHighlighted, setDetailsHighlighted] = useState("")
  const [payPage, setPayPage] = useState<boolean>(true);

  const {years, months} = useContext(DateContext) as DateContextType

  return (
    <>
      {login ? (
        <>
          <Header setLogin={setLogin} setDetailsTranslateX={setDetailsTranslateX} setDetailsHighlighted={setDetailsHighlighted} />
          <Routes>
            <Route path="/" element={<Home years={years} months={months} setPayPage={setPayPage} />} />
            <Route path="create" element={<Create years={years} months={months} payPage={payPage} setPayPage={setPayPage} />} />
            <Route path="details" element={<Details years={years} months={months} detailsTranslateX={detailsTranslateX} setDetailsTranslateX={setDetailsTranslateX} detailsHighlighted={detailsHighlighted} setDetailsHighlighted={setDetailsHighlighted} />} >
              <Route index element={<Navigate replace={true} to="pay"/>} />
              <Route path="pay" element={<Pay setPayPage={setPayPage} />} />
              <Route path="income" element={<Income setPayPage={setPayPage} />} />
              <Route path="remainder" element={<Remainder setPayPage={setPayPage} />} />
            </Route>
            <Route path="mapper" element={<Mapper years={years} months={months} setPayPage={setPayPage} />} />
          </Routes>
          <ToastContainer autoClose={1000} pauseOnFocusLoss={false} transition={Zoom} draggablePercent={50} />
        </>
      ) : (
        <>
          <Login setLogin={setLogin} />
          <ToastContainer autoClose={3000} pauseOnFocusLoss={false} transition={Zoom} draggablePercent={50} />
        </>
      )}
    </>
  );
};

export default App;
