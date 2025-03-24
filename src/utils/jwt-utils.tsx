import dayjs from '@/configs/day-js-config';
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

  const base64 = base64Url.replace('-', '+').replace('_', '/');
  const result = JSON.parse(window.atob(base64)) as IDecodedJwt;

  return result;
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

  const isExpired = dayjs.unix(decodedToken.exp).isBefore(dayjs());

  return { isCorrect: !isExpired, accessToken };
};
