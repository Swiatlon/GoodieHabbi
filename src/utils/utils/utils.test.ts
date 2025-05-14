import { getBestContrastTextColor, calculateProgress } from './utils';

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
});
