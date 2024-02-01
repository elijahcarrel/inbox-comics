import fetch from "isomorphic-unfetch";

type ElasticEmailResult<T> = {
  status: number;
  ok: boolean;
  result: T;
};

export const makeElasticEmailApiRequest = async <T>(
  endpoint: string,
  params: Record<string, string>,
  method = "GET",
): Promise<ElasticEmailResult<T>> => {
  const baseUrl = `https://api.elasticemail.com/v2/${endpoint}`;
  const url = new URL(baseUrl);
  url.searchParams.append("apikey", process.env.elasticemail_api_key || "");
  Object.entries(params).forEach(([key, value]) =>
    url.searchParams.append(key, value),
  );
  let body: URLSearchParams | undefined;
  let requestUrl = url.href;
  if (method === "POST") {
    requestUrl = baseUrl;
    body = url.searchParams;
  }
  // eslint-disable-next-line  no-console
  console.log(
    `Making ElasticEmail API request to URL "${requestUrl}" with method "${method}". Body not shown.`,
  );
  const fetchResponse = await fetch(requestUrl, {
    method,
    body,
  });
  if (!fetchResponse) {
    throw new Error("Got empty result from API request.");
  }
  const result = await fetchResponse.json();
  return {
    status: fetchResponse.status,
    ok: fetchResponse.ok,
    result,
  };
};
