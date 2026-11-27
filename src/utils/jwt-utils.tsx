import { IDecodedJwt } from '@/contract/auth/auth';
import { useTypedSelector } from '@/hooks/use-store-hooks';
import { NullableString } from '@/types/global-types';

export function parseJwt(token: NullableString): IDecodedJwt | undefined {
  if (!token) {
    return undefined;
  }

  const [, base64Url] = token.split('.');

  if (!base64Url) {
    return undefined;
  }

  try {
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');

    return JSON.parse(window.atob(base64)) as IDecodedJwt;
  } catch {
    return undefined;
  }
}

export const useIsCorrectAccessToken = () => {
  const accessToken = useTypedSelector(state => state.authSlice.token);

  const isValidTokenFormat = Boolean(accessToken && /^[A-Za-z0-9-._~+/]+=*$/.test(accessToken) && accessToken.split('.').length === 3);

  if (!isValidTokenFormat) {
    return { isCorrect: false, accessToken };
  }

  const decodedToken = parseJwt(accessToken);

  if (!decodedToken || !decodedToken.exp) {
    return { isCorrect: false, accessToken };
  }

  // Expiry is deliberately not checked here. An expired token is still a session: the next request gets a 401,
  // `baseQueryWithReauth` refreshes it, and only a refused refresh token logs the user out.
  return { isCorrect: true, accessToken };
};
