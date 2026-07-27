import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useTypedDispatch, useTypedSelector } from '@/hooks/use-store-hooks';
import { SnackbarVariantEnum, useSnackbar } from '@/providers/snackbar/snackbar-context';
import { apiErrorCleared, selectLastApiError } from '@/redux/state/api-error/api-error-state';

// Mounted once near the app root. Surfaces failed GET requests (finance history/categories/etc.)
// as a snackbar instead of the screen silently rendering empty state.
export const ApiErrorListener = () => {
  const { t } = useTranslation();
  const dispatch = useTypedDispatch();
  const { showSnackbar } = useSnackbar();
  const lastError = useTypedSelector(selectLastApiError);

  useEffect(() => {
    if (!lastError) return;

    showSnackbar({ text: `${t('common.dataLoadError')}: ${lastError.message}`, variant: SnackbarVariantEnum.ERROR });
    dispatch(apiErrorCleared());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastError]);

  return null;
};

export default ApiErrorListener;
