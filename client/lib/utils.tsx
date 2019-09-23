import { ApolloError } from "apollo-client";
import moment from "moment-timezone";
import { useRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";
import React, { useEffect, useState } from "react";
import { CommonLink } from "../common-components/CommonLink/CommonLink";
import {H3} from "../common-components/H3/H3";

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
    if (query != null && !queryIsReady) {
      setQueryIsReady(true);
    }
  }, [query, queryIsReady]);
  return [query, queryIsReady];
};

const toastOptions = {
  autoDismiss: true,
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

export const formattedComicDeliveryTime = () => {
  return moment().tz("America/New_York")
    .hour(6).minutes(0)
    .tz(moment.tz.guess())
    .format("h:mm a z");
};

export const defaultErrorAction = (
  <H3><CommonLink href="/">Go back to the home page.</CommonLink></H3>
);
