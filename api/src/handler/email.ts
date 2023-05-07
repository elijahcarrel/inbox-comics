import { GraphQLError } from "graphql";
import {
  userInputErrorOptions,
  internalEmailSendError,
  invalidUserError,
} from "../util/error";
import { User } from "../db-models/user";
import {
  emailAllUsersWithOptions,
  emailUsers,
} from "../service/email/comic-email-service";
import { cancelThrottledEmailsAndSendThemWithAwsWithOptions } from "../service/email/cancel-and-send-with-aws";
import { now } from "../util/date";
import {
  CancelThrottledEmailsOptions,
  EmailAllUsersOptions,
} from "../api-models/email-options";

export const emailUser = async (
  _: any,
  args: { email: string; options?: EmailAllUsersOptions },
) => {
  const { email, options = {} } = args;
  const date = now();
  const user = await User.findOne({ email }).exec();
  if (user == null) {
    throw invalidUserError(email);
  }
  if (!user.verified) {
    throw new GraphQLError(
      `User "${email}" is not verified.`,
      userInputErrorOptions,
    );
  }
  if (!user.enabled) {
    throw new GraphQLError(
      `User "${email}" is disabled.`,
      userInputErrorOptions,
    );
  }
  let messageIds: (string | null)[] = [];
  try {
    messageIds = await emailUsers([user], options, date);
  } catch (err) {
    throw internalEmailSendError(String(err));
  }
  if (messageIds.length > 0 && messageIds[0] != null) {
    return messageIds[0];
  }
  return null;
};

export const emailAllUsers = async (
  _: any,
  args: { options?: EmailAllUsersOptions },
) => {
  const date = now();
  const { options = {} } = args;
  try {
    return await emailAllUsersWithOptions(date, options);
  } catch (err) {
    throw internalEmailSendError(String(err));
  }
};

export const cancelThrottledEmailsAndSendThemWithAws = async (
  _: any,
  args: { options?: CancelThrottledEmailsOptions },
) => {
  const { options = {} } = args;
  try {
    return await cancelThrottledEmailsAndSendThemWithAwsWithOptions(options);
  } catch (err) {
    throw new GraphQLError(`Error cancelling throttled emails: ${err}.`);
  }
};
