import { create } from "zustand"

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

interface DateType {
    years: number;
    setPlusYear: (number: number) => void;
    setMinusYear: (number: number) => void;
    months: number;
    setMonths : (month: number) => void;
    value: Value;
    onChange: (value: Value) => void;
  }

interface FinanceType {
    payPage: boolean;
    setPayPage: (boolean: boolean) => void;
}

interface DetailBarType {
    detailsTranslateX: string;
    setDetailsTranslateX: (translateX: string) => void;
    detailsHighlighted: string;
    setDetailsHighlighted: (color: string) => void
}

export const useDate = create<DateType>((set) => ({
    years: new Date().getFullYear(),
    setPlusYear: (number) => set((state) => ({years: state.years + number})),
    setMinusYear: (number) => set((state) => ({years: state.years - number})),
    months: new Date().getMonth() + 1,
    setMonths: (month) => set({months : month}),
    value: new Date(),
    onChange: (value) => set({value})
}))

export const useFinance = create<FinanceType>((set) => ({
    payPage: true,
    setPayPage: (boolean) => set({payPage: boolean})
}))

export const useDetailBar = create<DetailBarType>((set) => ({
    detailsTranslateX: "",
    setDetailsTranslateX: (translateX) => set({detailsTranslateX: translateX}),
    detailsHighlighted: "",
    setDetailsHighlighted: (color) => set({detailsHighlighted: color})
}))