import { checkPricePositiveAndMapResult } from "../utils/checkPricePositiveAndMapResult";

describe("checkPricePositiveAndMapResult", () => {
  test("handle no location match mapResult", () => {
    const allItems = [
      { price: -100, item: "早餐", imageKey: "breakfast", note: "", location: "", id: "1" },
      { price: 200, item: "薪水", imageKey: "salary", note: "", location: "", id: "1" },
      { price: -50, item: "早餐", imageKey: "breakfast", note: "", location: "", id: "1" },
      { price: 150, item: "薪水", imageKey: "salary", note: "", location: "", id: "1" },
    ];
    const mapResult = "台北市";

    const result = checkPricePositiveAndMapResult(allItems, mapResult);
    expect(result).toEqual({
      eachPayOfCategories: {},
      eachIncomeOfCategories: {},
    });
  });

  test("check price is positive or not, should distribute to correct categories", () => {
    const allItems = [
      { price: -100, item: "早餐", imageKey: "breakfast", note: "", location: "台北市", id: "1" },
      { price: 200, item: "薪水", imageKey: "salary", note: "", location: "台北市", id: "1" },
      { price: -50, item: "早餐", imageKey: "breakfast", note: "", location: "台北市", id: "1" },
      { price: 150, item: "薪水", imageKey: "salary", note: "", location: "", id: "1" },
    ];
    const mapResult = "台北市";

    const result = checkPricePositiveAndMapResult(allItems, mapResult);
    expect(result).toEqual({
      eachPayOfCategories: { 早餐: [-100, -50] },
      eachIncomeOfCategories: { 薪水: [200] },
    });
  });

  test("check item can distribute correctly", () => {
    const allItems = [
      { price: -100, item: "早餐", imageKey: "breakfast", note: "", location: "台北市", id: "1" },
      { price: 200, item: "薪水", imageKey: "salary", note: "", location: "台北市", id: "1" },
      { price: -50, item: "早餐", imageKey: "breakfast", note: "", location: "台北市", id: "1" },
      { price: -150, item: "飲品", imageKey: "drinks", note: "", location: "台北市", id: "1" },
      { price: 3000, item: "交易", imageKey: "deal", note: "", location: "台北市", id: "1" },
      { price: -30, item: "點心", imageKey: "dessert", note: "", location: "台北市", id: "1" },
    ];
    const mapResult = "台北市";

    const result = checkPricePositiveAndMapResult(allItems, mapResult);
    expect(result).toEqual({
      eachPayOfCategories: { 早餐: [-100, -50],  飲品: [-150], 點心: [-30]},
      eachIncomeOfCategories: { 薪水: [200], 交易: [3000] },
    });
  });
});
