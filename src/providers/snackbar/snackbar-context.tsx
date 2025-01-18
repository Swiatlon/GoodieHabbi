import { createContext, useContext } from 'react';

export enum SnackbarVariantEnum {
  SUCCESS = 'success',
  INFO = 'info',
  ERROR = 'error',
}

export interface SnackbarOptions {
  text: string;
  variant?: SnackbarVariantEnum;
}

interface SnackbarContextProps {
  showSnackbar: (options: SnackbarOptions) => void;
}

export const SnackbarContext = createContext<SnackbarContextProps | undefined>(undefined);

export const useSnackbar = () => {
  const context = useContext(SnackbarContext);

  if (!context) {
    throw new Error('useSnackbar must be used within a SnackbarProvider');
  }

  return context;
};
