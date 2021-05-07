import { ApolloError, FetchResult } from "@apollo/client";
import { useRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";
import React, { useEffect, useState } from "react";
import { isEmpty } from "lodash";
import { Options } from "react-toast-notifications";
import { CommonLink } from "../common-components/CommonLink/CommonLink";
import { H3 } from "../common-components/H3/H3";

export interface GraphQlResult<T> {
  success: boolean;
  error: ApolloError | null;
  combinedErrorMessage: string | null;
  result: T;
}

export const stringifyGraphQlError = (error: ApolloError) => {
  return error.graphQLErrors.map(({ message }) => message).join(", ");
};

export async function handleGraphQlResponse<T>(
  requestPromise: Promise<FetchResult<T>>,
): Promise<GraphQlResult<FetchResult<T> | null>> {
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
}

export const useUrlQuery = (): [ParsedUrlQuery, boolean] => {
  const router = useRouter();
  const [queryIsReady, setQueryIsReady] = useState(false);
  const { query } = router;

  useEffect(() => {
    if (query != null && !queryIsReady) {
      setQueryIsReady(true);
    }
  }, [query, queryIsReady]);
  return [query, queryIsReady];
};

export const useNonEmptyUrlQuery = (): [ParsedUrlQuery, boolean] => {
  const router = useRouter();
  const [queryIsReady, setQueryIsReady] = useState(false);
  const { query } = router;

  useEffect(() => {
    if (query != null && !isEmpty(query) && !queryIsReady) {
      setQueryIsReady(true);
    }
  }, [query, queryIsReady]);
  return [query, queryIsReady];
};

const commonToastOptions: Partial<Options> = {
  autoDismiss: true,
};

export const toastType: Record<string, Options> = {
  error: {
    appearance: "error",
    ...commonToastOptions,
  },
  warning: {
    appearance: "warning",
    ...commonToastOptions,
  },
  success: {
    appearance: "success",
    ...commonToastOptions,
  },
  info: {
    appearance: "info",
    ...commonToastOptions,
  },
};

export const defaultErrorAction = (
  <H3>
    <CommonLink href="/">Go back to the home page.</CommonLink>
  </H3>
);
