import { useEffect, useLayoutEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Slot, useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import Loader from '@/components/shared/loader/loader';
import { SnackbarVariantEnum, useSnackbar } from '@/providers/snackbar/snackbar-context';
import { useRefreshAccessTokenMutation } from '@/redux/api/accounts-api';
import { setCredentials } from '@/redux/state/auth/auth-state';

const PersistLoginMiddleware = ({ children }: { children: React.JSX.Element }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { showSnackbar } = useSnackbar();
  const [refreshAccessToken, { data, error, isLoading }] = useRefreshAccessTokenMutation();
  const [isRefreshing, setIsRefreshing] = useState(true);

  useLayoutEffect(() => {
    const refreshAuthToken = async () => {
      const refreshToken = await SecureStore.getItemAsync('refreshToken');

      if (refreshToken) {
        refreshAccessToken({ refreshToken });
      } else {
        setIsRefreshing(false);
      }
    };

    refreshAuthToken();
  }, []);

  useEffect(() => {
    if (data?.accessToken) {
      dispatch(setCredentials({ accessToken: data.accessToken }));
      router.navigate('/(authorized)/dashboard');
      showSnackbar({ text: 'Logged in!', variant: SnackbarVariantEnum.SUCCESS });
    } else if (error) {
      showSnackbar({ text: 'Failed to refresh token. Please log in again.', variant: SnackbarVariantEnum.ERROR });
    }

    setIsRefreshing(false);
  }, [data, error]);

  if (isRefreshing || isLoading) {
    return (
      <Loader fullscreen>
        <Slot />
      </Loader>
    );
  }

  return children;
};

export default PersistLoginMiddleware;
