import { createContext, useContext } from 'react';

export const SnackbarVariantEnum = {
  SUCCESS: 'success',
  INFO: 'info',
  ERROR: 'error',
} as const;

export type SnackbarVariantEnumType = (typeof SnackbarVariantEnum)[keyof typeof SnackbarVariantEnum];

export interface SnackbarOptions {
  text: string;
  variant?: SnackbarVariantEnumType;
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
