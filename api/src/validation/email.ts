import { UserInputError, ApolloError } from "apollo-server-micro";
import { User } from "../db-models/user";
import {
    emailAllUsersWithOptions,
    emailUsers,
} from "../service/email/comic-email-service";
import { cancelThrottledEmailsAndSendThemWithAwsWithOptions } from "../service/email/cancel-and-send-with-aws";
import { now } from "../util/date";
import { internalEmailSendError, invalidUserError } from "../util/error";
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
        throw new UserInputError(`User "${email}" is not verified.`);
    }
    if (!user.enabled) {
        throw new UserInputError(`User "${email}" is disabled.`);
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

export const emailAllUsers = async (_: any, args: { options?: EmailAllUsersOptions }) => {
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
        throw new ApolloError(`Error cancelling throttled emails: ${err}.`);
    }
};
