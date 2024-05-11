import React, { useState, createContext, ReactNode } from "react";

interface DateContextType {
  years: number;
  setYears: React.Dispatch<React.SetStateAction<number>>;
  months: number;
  setMonths: React.Dispatch<React.SetStateAction<number>>;
}

export const DateContext = createContext<DateContextType | null>(null);

interface DateContextProviderProps {
  children: ReactNode;
}

export const DateContextProvider = ({ children }: DateContextProviderProps) => {
  const [years, setYears] = useState<number>(new Date().getFullYear());
  const [months, setMonths] = useState<number>(new Date().getMonth() + 1);

  const contextValue: DateContextType = {
    years,
    setYears,
    months,
    setMonths,
  };

  return (
    <DateContext.Provider value={contextValue}>
      {children}
    </DateContext.Provider>
  );
};
