import { SES } from "aws-sdk";

const config: SES.Types.ClientConfiguration = {
  accessKeyId: process.env.ses_access_key_id || "",
  secretAccessKey: process.env.ses_secret_access_key || "",
  region: "us-west-2",
};

const sesClient = new SES(config);

export const sendAwsSesEmail = async (
  to: string,
  subject: string,
  body: string,
  fromEmail = "comics@inboxcomics.com",
): Promise<string> => {
  const emailParams: SES.Types.SendEmailRequest = {
    Source: fromEmail,
    Destination: {
      ToAddresses: [to],
    },
    ReplyToAddresses: [],
    Message: {
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
    ConfigurationSetName: "CommonMessageConfiguration",
  };
  const result = await sesClient.sendEmail(emailParams).promise();
  if (result.$response.error) {
    throw new Error(
      `Error sending email: ${JSON.stringify(result.$response.error)}`,
    );
  }
  if (!result) {
    throw new Error("Error sending email: empty result.");
  }
  if (!result.$response.data) {
    throw new Error("Error sending email: empty response data.");
  }
  if (!result.MessageId) {
    throw new Error("Error sending email: no messageid was returned.");
  }
  return String(result.MessageId);
};
