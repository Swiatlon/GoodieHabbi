import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { SnackbarVariantEnum, useSnackbar } from '@/providers/snackbar/snackbar-context';
import { useRefreshAccessTokenMutation } from '@/redux/api/auth/auth-api';
import { setCredentials } from '@/redux/state/auth/auth-state';

const PersistLoginMiddleware = ({ children, onLoaded }: { children: React.JSX.Element; onLoaded: () => void }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { showSnackbar } = useSnackbar();
  const [refreshAccessToken, { data, error }] = useRefreshAccessTokenMutation();

  useEffect(() => {
    const refreshAuthToken = async () => {
      const refreshToken = await SecureStore.getItemAsync('refreshToken');

      if (refreshToken) {
        refreshAccessToken({ refreshToken });
      } else {
        onLoaded();
      }
    };

    refreshAuthToken();
  }, []);

  useEffect(() => {
    if (data?.accessToken) {
      dispatch(setCredentials({ accessToken: data.accessToken }));
      router.navigate('/(authorized)/dashboard');
      onLoaded();
      showSnackbar({ text: 'Logged in!', variant: SnackbarVariantEnum.SUCCESS });
    } else if (error) {
      showSnackbar({ text: 'Failed to refresh token. Please log in again.', variant: SnackbarVariantEnum.ERROR });
      onLoaded();
    }
  }, [data, error]);

  return children;
};

export default PersistLoginMiddleware;
