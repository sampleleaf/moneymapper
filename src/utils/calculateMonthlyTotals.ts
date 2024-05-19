import { Item } from "@/interfaces";

export const calculateMonthlyTotals = (allItemsOfMonth: Item[]) => {
  if (!allItemsOfMonth) return { monthPay: 0, monthIncome: 0 };

  return allItemsOfMonth.reduce(
    (acc, cur) => {
      if (cur.price < 0) {
        acc.monthPay += cur.price;
      } else if (cur.price > 0) {
        acc.monthIncome += cur.price;
      }
      return acc;
    },
    { monthPay: 0, monthIncome: 0 }
  );
};
