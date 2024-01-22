import { v4 as uuidv4 } from "uuid";
import { sortBy } from "lodash";
import { GraphQLError } from "graphql";
import { Syndication } from "../db-models/comic-syndication";
import { User } from "../db-models/user";
import { sendVerificationEmail } from "./email/templates/send-verification-email";
import {
  internalEmailSendError,
  invalidUserByPublicIdError,
  invalidUserError,
  userInputErrorOptions,
} from "../util/error";
import { InputUser } from "../api-models/user";

export const createUser = async (email: string) => {
  const existingUser = await User.findOne({ email }).exec();
  if (existingUser != null) {
    throw new GraphQLError(
      `User with email "${email}" already exists.`,
      userInputErrorOptions,
    );
  }
  const publicId = uuidv4();
  const verificationHash = uuidv4();
  const googleAnalyticsHash = uuidv4();
  const user = await User.create({
    email,
    publicId,
    verified: false,
    enabled: true,
    syndications: [],
    verificationHash,
    googleAnalyticsHash,
  });
  try {
    await sendVerificationEmail(email, user.verificationHash);
  } catch (err) {
    throw internalEmailSendError(String(err));
  }
  return user;
};

export const putUser = async (publicId: string, inputUser: InputUser) => {
  if (publicId !== inputUser.publicId) {
    throw new GraphQLError(
      `Mismatched public ids: ${publicId} and ${inputUser.publicId}.`,
      userInputErrorOptions,
    );
  }
  const user = await User.findOne({ publicId }).exec();
  if (user == null) {
    throw invalidUserByPublicIdError(publicId);
  }
  if (inputUser.syndications != null) {
    const syndicationIdentifiers = inputUser.syndications as string[];
    const foundSyndications = await Syndication.find({
      identifier: { $in: syndicationIdentifiers },
    });
    user.syndications = sortBy(foundSyndications, (foundSyndication) =>
      syndicationIdentifiers.indexOf(foundSyndication.identifier),
    );
  }
  let inputEmail: string | null = null;
  if (inputUser.email != null) {
    inputEmail = inputUser.email.toLowerCase();
  }
  const changedEmail =
    user.email !== inputEmail && !(user.email == null && inputEmail == null);
  if (changedEmail) {
    const existingUserWithThatEmail = await User.findOne({
      email: inputEmail,
    }).exec();
    if (existingUserWithThatEmail != null) {
      throw new GraphQLError(
        `User with email "${inputEmail}" already exists.`,
        userInputErrorOptions,
      );
    }
    user.email = inputEmail;
    user.verified = false;
  }
  if (inputUser.enabled != null) {
    user.enabled = inputUser.enabled;
  }
  await user.save();
  const { email } = user;
  if (changedEmail) {
    try {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore string | null | undefined is not assignable to type string.
      await sendVerificationEmail(email, user.verificationHash);
    } catch (err) {
      throw internalEmailSendError(String(err));
    }
  }
  return user;
};

export const unsubscribeUser = async (email: string) => {
  const user = await User.findOne({ email: email?.toLowerCase() || "" }).exec();
  if (user == null) {
    throw invalidUserError(email);
  }

  user.enabled = false;
  await user.save();
  return user;
};
