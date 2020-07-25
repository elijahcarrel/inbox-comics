import { NextRouter, useRouter } from "next/router";
import React from "react";
import { Layout } from "../common-components/Layout/Layout";
import { defaultErrorAction } from "../lib/utils";

interface Props {
  statusCode: number;
}

const pushWhenReady = (router: NextRouter, args: any) => {
  // If window is undefined, the router might not be ready to push yet.
  if (typeof window !== "undefined") {
    router.push(args);
  }
  return (
    <Layout title="Loading..." isLoading />
  );
};

const Error = (props: Props) => {
  const { statusCode } = props;
  const router = useRouter();
  // TOOD(ecarrel): use a real URL parser.
  if (router.asPath.startsWith("/subscribe.php")) {
    const { modifysettings, ...otherQuery } = router.query;
    if (modifysettings === "yes") {
      return pushWhenReady(router,{
        pathname: "/user",
        query: otherQuery,
      });
    } else {
      return pushWhenReady(router,{
        pathname: "/user/new",
        query: otherQuery,
      });
    }
  } else if (router.asPath.startsWith("/verify.php")) {
    return pushWhenReady(router,{
      pathname: "/user/verify",
      query: router.query,
    });
  } else if (router.asPath.includes(".php")) {
    const pathname = router.asPath.replace(".php", "");
    return pushWhenReady(router,{
      pathname,
      query: router.query,
    });
  }
  const errorMessage = statusCode
    ? `An unknown error (code ${statusCode}) occurred on server.`
    : "An unknown error occurred on client.";
  return (
    <Layout title="Error" error={errorMessage} errorAction={defaultErrorAction} />
  );
};

Error.getInitialProps = ({ res, err }: any) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : null;
  return { statusCode };
};

export default Error;
