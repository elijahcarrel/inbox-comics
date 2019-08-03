import isEmpty from "lodash/isEmpty";
import { useRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";
import { useEffect, useState } from "react";

interface GraphQlResult {
  success: boolean;
  error: string | null;
  result: any;
}

export const handleGraphQlResponse = async (requestPromise: Promise<any>): Promise<GraphQlResult> => {
  return requestPromise
  .then((result) => {
    return {
      success: true,
      error: null,
      result,
    };
  })
  .catch((error) => {
    return {
      success: false,
      error,
      result: null,
    };
  });
};

export const useUrlQuery = (): [ParsedUrlQuery, boolean] => {
  const router = useRouter();
  const [queryIsReady, setQueryIsReady] = useState(false);
  const { query } = router;

  useEffect(() => {
    if (query && !isEmpty(query) && !queryIsReady) {
      setQueryIsReady(true);
    }
  }, [query, queryIsReady]);
  return [query, queryIsReady];
};
