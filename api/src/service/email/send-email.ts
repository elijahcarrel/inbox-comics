import cheerio from "cheerio";
// @ts-ignore
import { client as Client } from "elasticemail-webapiclient";

const options = {
  apiKey: process.env.elasticemail_api_key || "",
  apiUri: "https://api.elasticemail.com/",
  apiVersion: "v2",
};
const elasticEmailClient = new Client(options);

type SendEmailResult = {
  success: boolean;
  data?: {
    transactionid?: string;
    messageid?: string;
  };
  error?: string;
};

export const sendEmail =
  async (to: string, subject: string, body: string, fromEmail: string = "comics@inboxcomics.com") => {
    const $ = cheerio.load(body);
    const updateSubscriptionsUrl = `${process.env.domain}/user?email=${encodeURIComponent(to)}`;
    $("body").append(`<a href="{unsubscribe:${updateSubscriptionsUrl}}"></a>`);
    // @ts-ignore ElasticEmail type definitions are wrong.
    const result: SendEmailResult = await elasticEmailClient.Email.Send({
      subject,
      to,
      // tslint:disable-next-line object-literal-key-quotes
      "from": "comics@inboxcomics.com",
      // @ts-ignore ElasticEmail type definitions are wrong.
      replyTo: fromEmail,
      body: $.html(),
      fromName: "Inbox Comics",
      bodyType: "HTML",
    });
    if (!result) {
      throw new Error("Unknown error sending email.");
    }
    if (!result.success) {
      throw new Error(`Error sending email: ${result.error}`);
    }
    if (!result.data || !result.data.messageid) {
      throw new Error("No messageid was returned.");
    }
    return result.data.messageid;
  };
