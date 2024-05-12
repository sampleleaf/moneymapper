import React, { useState, createContext, ReactNode } from "react";

interface DateContextType {
  years: number;
  setYears: React.Dispatch<React.SetStateAction<number>>;
  months: number;
  setMonths: React.Dispatch<React.SetStateAction<number>>;
  value: Value;
  onChange: React.Dispatch<React.SetStateAction<Value>>;
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

  const contextValue: DateContextType = {
    years,
    setYears,
    months,
    setMonths,
    value,
    onChange
  };

  return (
    <DateContext.Provider value={contextValue}>
      {children}
    </DateContext.Provider>
  );
};
