import cheerio from "cheerio";
import { makeElasticEmailApiRequest } from "../../client/elasticemail";

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
) => {
  const $ = cheerio.load(body);
  const updateSubscriptionsUrl = `${
    process.env.domain
  }/user?email=${encodeURIComponent(to)}`;
  $("body").append(`<a href="{unsubscribe:${updateSubscriptionsUrl}}"></a>`);
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore ElasticEmail type definitions are wrong.
  const result = await makeElasticEmailApiRequest<SendEmailResult>(
    "email/send",
    {
      subject,
      to,
      // eslint-disable-next-line  quote-props
      from: "comics@inboxcomics.com",
      replyTo: fromEmail,
      bodyHtml: $.html(),
      fromName: "Inbox Comics",
      bodyType: "HTML",
    },
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
