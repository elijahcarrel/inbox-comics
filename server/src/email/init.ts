// @ts-ignore
import { client as Client } from "elasticemail-webapiclient";

const options = {
  apiKey: process.env.elasticemail_api_key,
  apiUri: "https://api.elasticemail.com/",
  apiVersion: "v2",
};
const elasticEmailClient = new Client(options);

export const sendEmail = async (to: string, subject: string, body: string) => {
  const result = await elasticEmailClient.Email.Send({
    subject,
    to,
    // tslint:disable-next-line object-literal-key-quotes
    "from": "comics@inboxcomics.com",
    replyTo: "comics@inboxcomics.com",
    body,
    fromName: "Inbox Comics",
    bodyType: "HTML",
  });
  return !!result.messageid;
};
