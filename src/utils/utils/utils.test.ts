import { getBestContrastTextColor, calculateProgress, getDaysUntil } from './utils';

describe('Utils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });
  describe('getBestContrastTextColor', () => {
    const colorTests = [
      { input: '#FFFFFF', expected: 'black', description: 'light color' },
      { input: '#000000', expected: 'white', description: 'dark color' },
      { input: '#FFF', expected: 'black', description: 'short hex' },
      { input: 'invalid', expected: 'black', description: 'invalid input' },
    ];

    colorTests.forEach(({ input, expected, description }) => {
      it(`returns ${expected} for ${description}`, () => {
        expect(getBestContrastTextColor(input)).toBe(expected);
      });
    });
  });

  describe('calculateProgress', () => {
    const progressTests = [
      { current: 50, total: 100, expected: 50, description: 'normal case' },
      { current: 0, total: 100, expected: 0, description: 'zero current' },
      { current: 150, total: 100, expected: 100, description: 'over 100%' },
      { current: 50, total: 0, expected: 0, description: 'zero total' },
    ];

    progressTests.forEach(({ current, total, expected, description }) => {
      it(`calculates correctly for ${description}`, () => {
        expect(calculateProgress(current, total)).toBe(expected);
      });
    });
  });

  describe('getDaysUntil', () => {
    // Mid-afternoon on purpose: measuring from "now" instead of from today's date is what used to turn
    // tomorrow into "last day" and today into "expired".
    beforeEach(() => {
      jest.useFakeTimers().setSystemTime(new Date(2026, 6, 11, 15, 30));
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    const daysUntilTests = [
      { date: '2026-07-11', expected: 0, description: 'today, the last day' },
      { date: '2026-07-12', expected: 1, description: 'tomorrow' },
      { date: '2026-07-21', expected: 10, description: 'ten days ahead' },
      { date: '2026-07-10', expected: -1, description: 'yesterday, expired' },
      { date: '2026-08-01', expected: 21, description: 'a date in the next month' },
    ];

    daysUntilTests.forEach(({ date, expected, description }) => {
      it(`returns ${expected} for ${description}`, () => {
        expect(getDaysUntil(date)).toBe(expected);
      });
    });

    it('ignores the time of day just before midnight', () => {
      jest.setSystemTime(new Date(2026, 6, 11, 23, 59));

      expect(getDaysUntil('2026-07-12')).toBe(1);
    });
  });
});
