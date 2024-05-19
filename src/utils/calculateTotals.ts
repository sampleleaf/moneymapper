import { Item } from "@/interfaces";

export const calculateTotals = (itemsOfObject: Item[] | null) => {
  if (!itemsOfObject) return { totalOfPay: 0, totalOfIncome: 0 };

  return itemsOfObject.reduce(
    (acc, cur) => {
      if (cur.price < 0) {
        acc.totalOfPay += cur.price;
      } else if (cur.price > 0) {
        acc.totalOfIncome += cur.price;
      }
      return acc;
    },
    { totalOfPay: 0, totalOfIncome: 0 }
  );
};
