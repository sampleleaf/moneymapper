import { create } from "zustand"
import { DateType, FinanceType, DetailBarType } from "@/interfaces";

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