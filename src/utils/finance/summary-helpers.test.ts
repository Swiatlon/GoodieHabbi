import { getSavingsAmount } from './summary-helpers';

describe('getSavingsAmount', () => {
  it('sums only items in savings categories', () => {
    const expenseByCategory = [
      { categoryId: 1, amount: 100, percentage: 0, parentCategoryId: null },
      { categoryId: 2, amount: 50, percentage: 0, parentCategoryId: null },
      { categoryId: 3, amount: 25, percentage: 0, parentCategoryId: null },
    ];
    const savingsCategoryIds = new Set([2]);

    expect(getSavingsAmount(expenseByCategory, savingsCategoryIds)).toBe(50);
  });
});
