import cheerio from "cheerio";
// @ts-ignore
import { client as Client } from "elasticemail-webapiclient";

const options = {
  apiKey: process.env.elasticemail_api_key || "",
  apiUri: "https://api.elasticemail.com/",
  apiVersion: "v2",
};
const elasticEmailClient = new Client(options);

export const sendEmail =
  async (to: string, subject: string, body: string, fromEmail: string = "comics@inboxcomics.com") => {
    const $ = cheerio.load(body);
    const updateSubscriptionsUrl = `${process.env.domain}/user?email=${encodeURIComponent(to)}`;
    $("body").append(`<a href="{unsubscribe:${updateSubscriptionsUrl}}"></a>`);
    const result = await elasticEmailClient.Email.Send({
      subject,
      to,
      // tslint:disable-next-line object-literal-key-quotes
      "from": "comics@inboxcomics.com",
      // @ts-ignore replyTo does not exist.
      replyTo: fromEmail,
      body: $.html(),
      fromName: "Inbox Comics",
      bodyType: "HTML",
    });
    return !!result;
  };
