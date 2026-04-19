import { useEffect, useMemo, useState } from 'react';

export default function useSanityQuery(queryFn, params) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const paramsKey = useMemo(() => JSON.stringify(params ?? {}), [params]);
  const stableParams = useMemo(() => JSON.parse(paramsKey), [paramsKey]);

  useEffect(() => {
    let isActive = true;

    async function runQuery() {
      if (typeof queryFn !== 'function') {
        if (isActive) {
          setError(new Error('useSanityQuery requires a query function'));
          setLoading(false);
        }
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const result = await queryFn(stableParams);
        if (isActive) {
          setData(result);
        }
      } catch (queryError) {
        if (isActive) {
          setError(queryError);
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    }

    runQuery();

    return () => {
      isActive = false;
    };
  }, [queryFn, stableParams]);

  return { data, loading, error };
}
