import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useGetAccountDataQuery } from '@/redux/api/account/account-api';
import { useIsCorrectAccessToken } from '@/utils/jwt-utils';

const PrefetchMiddleware = ({ children, onLoaded }: { children: React.JSX.Element; onLoaded: () => void }) => {
  const dispatch = useDispatch();
  const { isCorrect } = useIsCorrectAccessToken();
  const { data, isLoading, refetch } = useGetAccountDataQuery({}, { skip: !isCorrect });

  useEffect(() => {
    if (isCorrect && !data && !isLoading) {
      refetch();
    }
  }, [data, isLoading, isCorrect]);

  useEffect(() => {
    if (data) {
      onLoaded();
    }
  }, [data, dispatch]);

  useEffect(() => {
    if (!isCorrect) {
      onLoaded();
    }
  }, [isCorrect]);

  return children;
};

export default PrefetchMiddleware;
