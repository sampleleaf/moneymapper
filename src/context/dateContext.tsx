import React, { useState, createContext, ReactNode } from "react";

interface DateContextType {
  years: number;
  setYears: React.Dispatch<React.SetStateAction<number>>;
  months: number;
  setMonths: React.Dispatch<React.SetStateAction<number>>;
  value: Value;
  onChange: React.Dispatch<React.SetStateAction<Value>>;
  payPage: boolean;
  setPayPage: React.Dispatch<React.SetStateAction<boolean>>
}

export const DateContext = createContext<DateContextType | null>(null);

interface DateContextProviderProps {
  children: ReactNode;
}

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

export const DateContextProvider = ({ children }: DateContextProviderProps) => {
  const [years, setYears] = useState<number>(new Date().getFullYear());
  const [months, setMonths] = useState<number>(new Date().getMonth() + 1);
  const [value, onChange] = useState<Value>(new Date(`${years}-${months}-${new Date().getDate()}`));
  const [payPage, setPayPage] = useState<boolean>(true);

  const contextValue: DateContextType = {
    years,
    setYears,
    months,
    setMonths,
    value,
    onChange,
    payPage,
    setPayPage
  };

  return (
    <DateContext.Provider value={contextValue}>
      {children}
    </DateContext.Provider>
  );
};
