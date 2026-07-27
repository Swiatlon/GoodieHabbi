import React, { useState } from 'react';
import { FinanceMonthContext } from './finance-month-context';
import dayjs from '@/configs/day-js-config';

const MIN_YEAR = 2020;
const MAX_YEAR = 2030;

export const FinanceMonthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const now = dayjs();
  const [year, setYear] = useState(now.year());
  const [month, setMonth] = useState(now.month() + 1);

  const goToPreviousMonth = () => {
    if (month === 1) {
      if (year <= MIN_YEAR) return;
      setYear(year - 1);
      setMonth(12);
    } else {
      setMonth(month - 1);
    }
  };

  const goToNextMonth = () => {
    if (month === 12) {
      if (year >= MAX_YEAR) return;
      setYear(year + 1);
      setMonth(1);
    } else {
      setMonth(month + 1);
    }
  };

  return (
    <FinanceMonthContext.Provider value={{ year, month, setYear, setMonth, goToPreviousMonth, goToNextMonth }}>
      {children}
    </FinanceMonthContext.Provider>
  );
};

export default FinanceMonthProvider;
