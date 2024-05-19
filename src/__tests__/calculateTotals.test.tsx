import { calculateTotals } from "../utils/calculateTotals";

describe("calculateTotals", () => {
  test("should return { totalOfPay: 0, totalOfIncome: 0 } if allItemsOfMonth is empty", () => {
    expect(calculateTotals([])).toEqual({ totalOfPay: 0, totalOfIncome: 0 });
  });

  test("should correctly calculate totalOfPay and totalOfIncome", () => {
    const allItemsOfMonth = [
      { price: -100, item: "早餐", note: "早餐", location: "", id: "1" },
      { price: 200, item: "早餐", note: "早餐", location: "", id: "1" },
      { price: -50, item: "早餐", note: "早餐", location: "", id: "1" },
      { price: 150, item: "早餐", note: "早餐", location: "", id: "1" },
    ];

    const result = calculateTotals(allItemsOfMonth);
    expect(result).toEqual({ totalOfPay: -150, totalOfIncome: 350 });
  });

  test("should handle an empty array", () => {
    const result = calculateTotals([]);
    expect(result).toEqual({ totalOfPay: 0, totalOfIncome: 0 });
  });

  test("should handle array with only positive prices", () => {
    const allItemsOfMonth = [
      { price: 100, item: "早餐", note: "早餐", location: "", id: "1" },
      { price: 200, item: "早餐", note: "早餐", location: "", id: "1" },
      { price: 300, item: "早餐", note: "早餐", location: "", id: "1" },
    ];

    const result = calculateTotals(allItemsOfMonth);
    expect(result).toEqual({ totalOfPay: 0, totalOfIncome: 600 });
  });

  test("should handle array with only negative prices", () => {
    const allItemsOfMonth = [
      { price: -100, item: "早餐", note: "早餐", location: "", id: "1" },
      { price: -200, item: "早餐", note: "早餐", location: "", id: "1" },
      { price: -300, item: "早餐", note: "早餐", location: "", id: "1" },
    ];

    const result = calculateTotals(allItemsOfMonth);
    expect(result).toEqual({ totalOfPay: -600, totalOfIncome: 0 });
  });
});
