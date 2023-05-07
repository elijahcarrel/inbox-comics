import { GraphQLError } from "graphql";
import { ApolloServerErrorCode } from "@apollo/server/errors";

export const userInputErrorOptions = {
  extensions: {
    code: ApolloServerErrorCode.BAD_USER_INPUT,
    myExtension: "inbox-comics",
  },
};
export const invalidUserError = (email: string) =>
  new GraphQLError(`No user with email "${email}".`, userInputErrorOptions);
export const invalidUserByPublicIdError = (publicId: string) =>
  new GraphQLError(`No user with id "${publicId}".`, userInputErrorOptions);
export const invalidSyndicationError = (identifier: string) =>
  new GraphQLError(
    `No syndication with identifier "${identifier}".`,
    userInputErrorOptions,
  );
export const invalidNewsItemError = (identifier: string) =>
  new GraphQLError(
    `No news item with identifier "${identifier}".`,
    userInputErrorOptions,
  );
export const internalEmailSendError = (errMsg: string) =>
  new GraphQLError(`Error sending email: ${errMsg}.`);
