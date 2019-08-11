import { UserInputError } from "apollo-server-micro";
export const invalidUserError = (email: string) =>
  new UserInputError(`No user with email "${email}".`);
export const invalidSyndicationError = (identifier: string) =>
  new UserInputError(`No syndication with identifier "${identifier}".`);
