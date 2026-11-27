import { getDefaultOccurredOn } from './form-helpers';

describe('getDefaultOccurredOn', () => {
  beforeEach(() => {
    // Local-time constructor, so the expected day does not depend on the machine's time zone.
    jest.useFakeTimers().setSystemTime(new Date(2026, 0, 31, 12));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('returns today when the current month is viewed', () => {
    expect(getDefaultOccurredOn(2026, 1)).toBe('2026-01-31');
  });

  it('returns the first day of another month', () => {
    // February is shorter than today's day-of-month, so this also guards against overflowing into March.
    expect(getDefaultOccurredOn(2026, 2)).toBe('2026-02-01');
    expect(getDefaultOccurredOn(2025, 12)).toBe('2025-12-01');
  });

  it('does not treat the same month of another year as current', () => {
    expect(getDefaultOccurredOn(2025, 1)).toBe('2025-01-01');
  });
});
