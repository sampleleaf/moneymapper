import { calculateMonthlyTotals } from "../utils/calculateMonthlyTotals";

describe("calculateMonthlyTotals", () => {
  test("should return { monthPay: 0, monthIncome: 0 } if allItemsOfMonth is empty", () => {
    expect(calculateMonthlyTotals([])).toEqual({ monthPay: 0, monthIncome: 0 });
  });

  test("should correctly calculate monthPay and monthIncome", () => {
    const allItemsOfMonth = [
      { price: -100, item: "早餐", note: "早餐", location: "", id: "1" },
      { price: 200, item: "早餐", note: "早餐", location: "", id: "1" },
      { price: -50, item: "早餐", note: "早餐", location: "", id: "1" },
      { price: 150, item: "早餐", note: "早餐", location: "", id: "1" },
    ];

    const result = calculateMonthlyTotals(allItemsOfMonth);
    expect(result).toEqual({ monthPay: -150, monthIncome: 350 });
  });

  test("should handle an empty array", () => {
    const result = calculateMonthlyTotals([]);
    expect(result).toEqual({ monthPay: 0, monthIncome: 0 });
  });

  test("should handle array with only positive prices", () => {
    const allItemsOfMonth = [
      { price: 100, item: "早餐", note: "早餐", location: "", id: "1" },
      { price: 200, item: "早餐", note: "早餐", location: "", id: "1" },
      { price: 300, item: "早餐", note: "早餐", location: "", id: "1" },
    ];

    const result = calculateMonthlyTotals(allItemsOfMonth);
    expect(result).toEqual({ monthPay: 0, monthIncome: 600 });
  });

  test("should handle array with only negative prices", () => {
    const allItemsOfMonth = [
      { price: -100, item: "早餐", note: "早餐", location: "", id: "1" },
      { price: -200, item: "早餐", note: "早餐", location: "", id: "1" },
      { price: -300, item: "早餐", note: "早餐", location: "", id: "1" },
    ];

    const result = calculateMonthlyTotals(allItemsOfMonth);
    expect(result).toEqual({ monthPay: -600, monthIncome: 0 });
  });
});
