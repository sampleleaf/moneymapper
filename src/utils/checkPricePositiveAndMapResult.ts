import { Item } from "@/interfaces";

export const checkPricePositiveAndMapResult = (
  allItems: Item[],
  mapResult: string,
) => {
  const eachPayOfCategories: { [category: string]: number[] } = {};
  const eachIncomeOfCategories: { [category: string]: number[] } = {};
  allItems.forEach((item) => {
    if (item.location === mapResult) {
      const splitCategories =
        item.price < 0 ? eachPayOfCategories : eachIncomeOfCategories;
      if (item.item in splitCategories) {
        splitCategories[item.item].push(item.price);
      } else {
        splitCategories[item.item] = [item.price];
      }
    }
  });

  return {eachPayOfCategories, eachIncomeOfCategories}
};
