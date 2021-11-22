import {
  SESv2Client,
  SESv2ClientConfig,
  SendEmailRequest,
  SendEmailCommand,
  SendEmailCommandOutput,
} from "@aws-sdk/client-sesv2";

const config: SESv2ClientConfig = {
  credentials: {
    accessKeyId: process.env.ses_access_key_id || "",
    secretAccessKey: process.env.ses_secret_access_key || "",
  },
  region: "us-west-2",
};

const sesClient = new SESv2Client(config);

export const sendAwsSesEmail = async (
  to: string,
  subject: string,
  body: string,
  fromEmail = "comics@inboxcomics.com",
): Promise<string> => {
  const emailParams: SendEmailRequest = {
    FromEmailAddress: fromEmail,
    Destination: {
      ToAddresses: [to],
    },
    ReplyToAddresses: [],
    Content: {
      Simple: {
        Body: {
          Html: {
            Charset: "UTF-8",
            Data: body,
          },
        },
        Subject: {
          Charset: "UTF-8",
          Data: subject,
        },
      },
    },
    ConfigurationSetName: "CommonMessageConfiguration",
  };
  const command = new SendEmailCommand(emailParams);
  let result: SendEmailCommandOutput;
  try {
    result = await sesClient.send(command);
  } catch (error) {
    throw new Error(`Error sending email: ${JSON.stringify(error)}`);
  }
  if (!result) {
    throw new Error("Error sending email: empty result.");
  }
  if (!result.MessageId) {
    throw new Error("Error sending email: no messageid was returned.");
  }
  return String(result.MessageId);
};
