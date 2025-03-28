import { useState, useEffect } from 'react';
import { Dayjs } from 'dayjs';
import dayjs from '@/configs/day-js-config';

export type Frequency = 'daily' | 'weekly' | 'monthly' | 'yearly';

interface TimeRemaining {
  months?: string;
  weeks?: string;
  days?: string;
  hours: string;
  minutes: string;
  seconds: string;
  totalSeconds: number;
  frequency?: Frequency;
}

interface UseTimerProps {
  frequency: Frequency;
  enabled: boolean;
}

const useTimer = ({ frequency, enabled }: UseTimerProps) => {
  const [timeLeft, setTimeLeft] = useState<string>(formatTime(calculateTimeRemaining(frequency)));
  const [timeColor, setTimeColor] = useState<string>('text-primary');

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (enabled) {
      interval = setInterval(() => {
        const remainingTime = calculateTimeRemaining(frequency);
        setTimeLeft(formatTime(remainingTime));
        setTimeColor(getTimeColor(remainingTime.totalSeconds, frequency));
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [frequency, enabled]);

  return {
    timeLeft,
    timeColor,
  };
};

export default useTimer;

function formatNumber(num: number): string {
  return num.toString().padStart(2, '0');
}

function formatTime(time: TimeRemaining): string {
  const units: (keyof TimeRemaining)[] = ['months', 'weeks', 'days', 'hours', 'minutes', 'seconds'];

  return (
    units
      .filter(unit => time[unit] && time[unit] !== '00')
      .map(unit => `${time[unit]}${unit}`)
      .join(':') || '0s'
  );
}

function getTimeToEndOfDay(now: Dayjs = dayjs()): TimeRemaining {
  const endOfDay = now.endOf('day');
  const diffToEndOfDay = endOfDay.diff(now, 'seconds');

  return {
    hours: formatNumber(Math.floor(diffToEndOfDay / 3600)),
    minutes: formatNumber(Math.floor((diffToEndOfDay % 3600) / 60)),
    seconds: formatNumber(diffToEndOfDay % 60),
    totalSeconds: diffToEndOfDay,
  };
}

function getTimeToEndOfWeek(now: Dayjs = dayjs()): TimeRemaining {
  const endOfWeek = now.weekday(7).endOf('day');
  const diffToEndOfWeek = endOfWeek.diff(now, 'seconds');

  return {
    days: formatNumber(Math.floor(diffToEndOfWeek / (24 * 3600))),
    ...getTimeToEndOfDay(),
    totalSeconds: diffToEndOfWeek,
  };
}

function getTimeToEndOfMonth(now: Dayjs = dayjs()): TimeRemaining {
  const endOfMonth = now.endOf('month');
  const diffToEndOfMonth = endOfMonth.diff(now, 'seconds');

  return {
    weeks: formatNumber(Math.floor(diffToEndOfMonth / (7 * 24 * 3600))),
    days: formatNumber(Math.floor((diffToEndOfMonth % (7 * 24 * 3600)) / (24 * 3600))),
    ...getTimeToEndOfDay(),
    totalSeconds: diffToEndOfMonth,
  };
}

function getTimeToEndOfYear(now: Dayjs = dayjs()): TimeRemaining {
  const endOfYear = now.endOf('year');
  const monthsRemaining = endOfYear.diff(now, 'months');
  const remainingDays = endOfYear.subtract(monthsRemaining, 'months').diff(now, 'days');
  const diffToEndOfYear = endOfYear.diff(now, 'seconds');

  return {
    months: formatNumber(monthsRemaining),
    weeks: formatNumber(Math.floor(remainingDays / 7)),
    days: formatNumber(remainingDays % 7),
    ...getTimeToEndOfDay(),
    totalSeconds: diffToEndOfYear,
  };
}

function calculateTimeRemaining(type: Frequency): TimeRemaining {
  const now = dayjs();

  switch (type) {
    case 'daily':
      return { frequency: type, ...getTimeToEndOfDay(now) };
    case 'weekly':
      return { frequency: type, ...getTimeToEndOfWeek() };
    case 'monthly':
      return { frequency: type, ...getTimeToEndOfMonth() };
    case 'yearly':
      return { frequency: type, ...getTimeToEndOfYear() };
    default:
      throw new Error('Invalid frequency');
  }
}

function getTimeColor(totalSeconds: number, frequency: Frequency): string {
  const thresholds: Record<Frequency, { warning: number; error: number }> = {
    daily: { warning: 6 * 60 * 60, error: 1 * 60 * 60 },
    weekly: { warning: 3 * 24 * 60 * 60, error: 24 * 60 * 60 },
    monthly: { warning: 7 * 24 * 60 * 60, error: 3 * 24 * 60 * 60 },
    yearly: { warning: 14 * 24 * 60 * 60, error: 7 * 24 * 60 * 60 },
  };

  if (totalSeconds < thresholds[frequency].error) {
    return 'text-error';
  } else if (totalSeconds < thresholds[frequency].warning) {
    return 'text-warning';
  }

  return 'text-primary';
}
