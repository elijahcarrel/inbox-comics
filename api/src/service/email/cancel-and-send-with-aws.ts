import { makeElasticEmailApiRequest } from "../../client/elasticemail";
import { CancelThrottledEmailsOptions } from "../../api-models/email-options";
import { sendAwsSesEmail } from "./send-aws-ses-email";

type LoadLogResult = {
  success: boolean;
  data?: {
    recipients: {
      msgid: string;
      jobid: string;
      to: string;
      messagecategory: string;
      status: string;
    }[];
  };
  error?: string;
};

type ViewEmailResult = {
  success: boolean;
  data?: {
    body: string;
    subject: string;
    from: string;
  };
  error?: string;
};

type CancelInProgressResult = {
  success: boolean;
  error?: string;
};

export const cancelThrottledEmailsAndSendThemWithAws = async (
  options?: CancelThrottledEmailsOptions,
): Promise<boolean> => {
  console.log("cancelThrottledEmailsAndSendThemWithAws called");
  const { limit = 3 } = options || {};
  const actualEvents = await makeElasticEmailApiRequest<LoadLogResult>(
    "log/load",
    {
      statuses: "2",
      limit: String(limit),
    },
  );
  console.log(
    "got the following potential events to cancel: ",
    JSON.stringify(actualEvents?.result?.data?.recipients || []),
  );
  const filteredRecipients =
    actualEvents?.result?.data?.recipients?.filter(
      ({ messagecategory, status }) =>
        messagecategory === "Throttled" && status === "WaitingToRetry",
    ) || [];
  const messagesToCancel = filteredRecipients.map((recipient) => ({
    msgId: recipient.msgid,
    jobId: recipient.jobid,
    toEmail: recipient.to,
  }));
  const newEmails = await Promise.all(
    messagesToCancel.map(async ({ msgId, toEmail }) => {
      const viewEmailResult = await makeElasticEmailApiRequest<ViewEmailResult>(
        "email/view",
        {
          messageID: msgId,
        },
      );
      if (!viewEmailResult?.result?.data?.body) {
        throw new Error(`Could not get email with message id ${msgId}`);
      }
      return {
        body: viewEmailResult.result.data.body,
        subject: viewEmailResult.result.data.subject,
        fromEmail: viewEmailResult.result.data.from,
        toEmail,
      };
    }),
  );
  console.log(
    "cancelling the following messages: ",
    JSON.stringify(messagesToCancel),
  );
  await Promise.all(
    messagesToCancel.map(async ({ jobId }) => {
      const cancelInProgressResult = await makeElasticEmailApiRequest<CancelInProgressResult>(
        "log/cancelinprogress",
        {
          transactionID: jobId,
        },
      );
      if (!cancelInProgressResult?.result?.success) {
        throw new Error(
          `Could not cancel email with job id ${jobId}: ${cancelInProgressResult?.result?.error}`,
        );
      }
    }),
  );
  await Promise.all(
    newEmails.map(async ({ body, subject, fromEmail, toEmail }) => {
      await sendAwsSesEmail(toEmail, subject, body, fromEmail);
    }),
  );
  return true;
};
