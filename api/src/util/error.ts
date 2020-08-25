import { UserInputError, ApolloError } from "apollo-server-micro";

export const invalidUserError = (email: string) =>
  new UserInputError(`No user with email "${email}".`);
export const invalidUserByPublicIdError = (publicId: string) =>
  new UserInputError(`No user with id "${publicId}".`);
export const invalidSyndicationError = (identifier: string) =>
  new UserInputError(`No syndication with identifier "${identifier}".`);
export const invalidNewsItemError = (identifier: string) =>
  new UserInputError(`No news item with identifier "${identifier}".`);
export const internalEmailSendError = (errMsg: string) =>
  new ApolloError(`Error sending email: ${errMsg}.`);
