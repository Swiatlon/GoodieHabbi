import { useEffect } from 'react';
import { useRouter, useSegments } from 'expo-router';
import { useIsCorrectAccessToken } from '@/utils/jwt-utils';

const RoutesPermissionMiddleware = ({ children }: { children: React.JSX.Element }) => {
  const { isCorrect } = useIsCorrectAccessToken();
  const router = useRouter();
  const segments = useSegments() as string[];

  const isAuthenticatedRoute = segments.includes('(authorized)');

  useEffect(() => {
    if (!isCorrect && isAuthenticatedRoute) {
      router.replace('/(not-authorized)/login');
    } else if (isCorrect && !isAuthenticatedRoute) {
      router.replace('/(authorized)/dashboard');
    }
  }, [isCorrect, isAuthenticatedRoute, router]);

  return children;
};

export default RoutesPermissionMiddleware;
