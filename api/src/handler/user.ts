import { v4 as uuidv4 } from "uuid";
import { UserInputError } from "apollo-server-errors";
import { User } from "../db-models/user";
import {
  internalEmailSendError,
  invalidUserByPublicIdError,
  invalidUserError,
} from "../util/error";
import {
  createUser as serviceCreateUser,
  putUser as servicePutUser,
} from "../service/user";
import { InputUser } from "../api-models/user";
import { sendVerificationEmail } from "../service/email/templates/send-verification-email";
import { sendContactEmail } from "../service/email/templates/send-contact-email";

export const userByEmail = async (_: any, args: { email: string }) => {
  const { email: rawEmail } = args;
  const email = rawEmail.toLowerCase();
  const user = await User.findOne({ email }).exec();
  if (user == null) {
    throw invalidUserError(email);
  }
  // TODO(ecarrel): only populate syndications and emails if they're requested?
  return user.populate(["syndications", "emails"]);
};

export const userByPublicId = async (_: any, args: { publicId: string }) => {
  const { publicId } = args;
  const user = await User.findOne({ publicId }).exec();
  if (user == null) {
    throw invalidUserByPublicIdError(publicId);
  }
  // TODO(ecarrel): only populate syndications and emails if they're requested?
  return user.populate(["syndications", "emails"]);
};

export const createUser = async (_: any, args: { email: string }) =>
  serviceCreateUser(args.email);

export const createUserWithoutEmail = async () => {
  const verificationHash = uuidv4();
  const googleAnalyticsHash = uuidv4();
  const publicId = uuidv4();
  return User.create({
    publicId,
    verified: false,
    enabled: true,
    syndications: [],
    verificationHash,
    googleAnalyticsHash,
  });
};

// TODO(ecarrel): type of user is wrong; should be an api object type.
export const putUser = async (
  _: any,
  args: { publicId: string; user: InputUser },
) => servicePutUser(args.publicId, args.user);

export const resendVerificationEmail = async (
  _: any,
  args: { email: string },
) => {
  const { email } = args;
  const user = await User.findOne({ email }).exec();
  if (user == null) {
    throw invalidUserError(email);
  }
  try {
    await sendVerificationEmail(email, user.verificationHash);
  } catch (err) {
    throw internalEmailSendError(String(err));
  }
};

export const verifyEmail = async (
  _: any,
  args: { email: string; verificationHash: string },
) => {
  const { email, verificationHash } = args;
  const user = await User.findOne({ email }).exec();
  if (user == null) {
    throw invalidUserError(email);
  }
  if (user.verified) {
    // Simply return true. No use returning an error if, say, the user accidentally clicks the link twice.
    return true;
  }
  if (user.verificationHash === verificationHash) {
    user.verified = true;
    await user.save();
    return true;
  }
  throw new UserInputError("Incorrect verification string.");
};

export const submitContactForm = async (
  _: any,
  args: { email: string; name: string; subject: string; message: string },
) => {
  const { email, name, subject, message } = args;
  try {
    await sendContactEmail(name, email, subject, message);
  } catch (err) {
    throw internalEmailSendError(String(err));
  }
};
