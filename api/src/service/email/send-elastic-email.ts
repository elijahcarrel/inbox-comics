import * as cheerio from "cheerio";
import { makeElasticEmailApiRequest } from "../../client/elasticemail";
import { getUnsubscribeUrl } from "../../util/url";

type SendEmailResult = {
  success: boolean;
  data?: {
    transactionid?: string;
    messageid?: string;
  };
  error?: string;
};

export const sendElasticEmail = async (
  to: string,
  subject: string,
  body: string,
  fromEmail = "comics@inboxcomics.com",
  includeUnsubscribeHeader = true,
) => {
  const $ = cheerio.load(body);
  const unsubscribeUrl = getUnsubscribeUrl(to);
  $("body").append(`<a href="{unsubscribe:${unsubscribeUrl}}"></a>`);
  const params: Record<string, string> = {
    subject,
    to,
    // eslint-disable-next-line  quote-props
    from: "comics@inboxcomics.com",
    replyTo: fromEmail,
    bodyHtml: $.html(),
    fromName: "Inbox Comics",
    bodyType: "HTML",
  };
  if (includeUnsubscribeHeader) {
    params["allowCustomHeaders"] = "true";
    params["headers_List-Unsubscribe-Post"] =
      "List-Unsubscribe-Post: List-Unsubscribe=One-Click";
    // params["headers_List-Unsubscribe"] =
    //   `List-Unsubscribe: <${encodeURIComponent(unsubscribeUrl)}>`;
  }
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore ElasticEmail type definitions are wrong.
  const result = await makeElasticEmailApiRequest<SendEmailResult>(
    "email/send",
    params,
    "POST",
  );
  if (!result) {
    throw new Error("Unknown error sending email.");
  }
  if (!result?.result?.success) {
    throw new Error(`Error sending email: ${result?.result?.error}`);
  }
  if (!result.result.data?.messageid) {
    throw new Error("No messageid was returned.");
  }
  return result.result.data.messageid;
};
