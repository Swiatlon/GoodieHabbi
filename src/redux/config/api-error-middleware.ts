import { isRejectedWithValue, type Middleware } from '@reduxjs/toolkit';
import { apiErrorOccurred } from '../state/api-error/api-error-state';

interface FetchBaseQueryErrorLike {
  status?: number | string;
  data?: {
    title?: string;
    message?: string;
    errors?: Record<string, string[]>;
  };
}

interface RtkQueryRejectedMeta {
  arg?: {
    endpointName?: string;
    type?: 'query' | 'mutation';
  };
}

const extractErrorMessage = (payload: unknown): string => {
  const error = payload as FetchBaseQueryErrorLike | undefined;
  const data = error?.data;

  const firstValidationMessage = data?.errors && Object.values(data.errors)[0]?.[0];
  if (firstValidationMessage) return firstValidationMessage;
  if (data?.title) return data.title;
  if (data?.message) return data.message;
  if (error?.status === 'FETCH_ERROR') return 'Brak połączenia z serwerem.';
  if (error?.status === 'TIMEOUT_ERROR') return 'Przekroczono czas oczekiwania na odpowiedź serwera.';
  if (typeof error?.status === 'number') return `Błąd serwera (${error.status}).`;

  return 'Wystąpił nieoczekiwany błąd.';
};

// Logs every failed RTK Query call and surfaces failed GET queries as a snackbar via apiErrorOccurred.
// Mutations are excluded from the snackbar to avoid double-toasting endpoints that already show their own error message.
export const apiErrorMiddleware: Middleware = storeApi => next => action => {
  if (isRejectedWithValue(action)) {
    const meta = (action as { meta?: RtkQueryRejectedMeta }).meta;
    const endpointName = meta?.arg?.endpointName ?? 'unknown';
    const requestType = meta?.arg?.type;
    const message = extractErrorMessage(action.payload);

    // eslint-disable-next-line no-console
    console.error(`[API] ${requestType ?? 'request'} "${endpointName}" failed:`, action.payload);

    if (requestType === 'query') {
      storeApi.dispatch(apiErrorOccurred({ endpointName, message }));
    }
  }

  return next(action);
};
