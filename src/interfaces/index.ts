export interface Item {
  id: string;
  item: string;
  imageKey: string;
  note: string;
  price: number;
  location: string;
}

export interface GeoType {
  [key: string]: {
    type: string;
    coordinates: number[][][] | number[][][][];
  };
}

export interface TaiwanGeoType {
  type: string;
  coordinates: number[][][] | number[][][][];
}

export interface Images {
  [key: string]: string;
}

//for zustand
type ValuePiece = Date | null;
export type Value = ValuePiece | [ValuePiece, ValuePiece];

export interface DateType {
    years: number;
    setPlusYear: (number: number) => void;
    setMinusYear: (number: number) => void;
    months: number;
    setMonths : (month: number) => void;
    calendarDate: Value;
    setCalendarDate: (value: Value) => void;
  }

export interface FinanceType {
    payPage: boolean;
    setPayPage: (boolean: boolean) => void;
}

export interface DetailBarType {
    detailsTranslateX: string;
    setDetailsTranslateX: (translateX: string) => void;
    detailsHighlighted: string;
    setDetailsHighlighted: (color: string) => void
}