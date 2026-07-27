import { createContext, useContext } from 'react';

interface FinanceMonthContextProps {
  year: number;
  month: number;
  setYear: (year: number) => void;
  setMonth: (month: number) => void;
  goToPreviousMonth: () => void;
  goToNextMonth: () => void;
}

export const FinanceMonthContext = createContext<FinanceMonthContextProps | undefined>(undefined);

export const useFinanceMonth = () => {
  const context = useContext(FinanceMonthContext);

  if (!context) {
    throw new Error('useFinanceMonth must be used within a FinanceMonthProvider');
  }

  return context;
};
