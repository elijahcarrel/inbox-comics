import { ApolloError } from "apollo-client";
import isEmpty from "lodash/isEmpty";
import { useRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";
import { useEffect, useState } from "react";

export interface GraphQlResult {
  success: boolean;
  error: ApolloError | null;
  combinedErrorMessage: string | null;
  result: any;
}

export const stringifyGraphQlError = (error: ApolloError) => {
  return error.graphQLErrors.map(({ message }) => message).join(", ");
};

export const handleGraphQlResponse = async (requestPromise: Promise<any>): Promise<GraphQlResult> => {
  return requestPromise
  .then((result) => {
    return {
      success: true,
      error: null,
      combinedErrorMessage: null,
      result,
    };
  })
  .catch((error: ApolloError) => {
    return {
      success: false,
      error,
      combinedErrorMessage: stringifyGraphQlError(error),
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

const toastOptions = {
  autoDismiss: true,
  pauseOnHover: true,
};

export const toastType = {
  error: {
    appearance: "error",
    ...toastOptions,
  },
  warning: {
    appearance: "warning",
    ...toastOptions,
  },
  success: {
    appearance: "success",
    ...toastOptions,
  },
  info: {
    appearance: "info",
    ...toastOptions,
  },
};