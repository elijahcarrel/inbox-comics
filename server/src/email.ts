import { gql } from "apollo-server-micro";
import { ApolloError } from "apollo-server-micro";
import { UserInputError } from "apollo-server-micro";
import moment from "moment-timezone";
import { sendComicEmail } from "./email/send-comic-email";
import { ISyndication } from "./syndication";
import { User } from "./user";
import { IUser } from "./user";
import { now } from "./util/date";
import { invalidUserError } from "./util/error";

export const typeDefs = gql`
  extend type Mutation {
    emailUser(email: String!): Boolean,
    emailAllUsers: Boolean,
  }
`;

export const resolvers = {
  Mutation: {
    emailUser: async (_: any, args: {
      email: string,
      sendAllComics: boolean,
      mentionNotUpdatedComics: boolean,
    }) => {
      // TODO(ecarrel): this function is just a less functional version of emailAllUsers.
      //  (Namely, it doesn't update the user afterwards.) Dedupe code.
      const { email, sendAllComics = false, mentionNotUpdatedComics = true } = args;
      const user = await User.findOne({ email }).exec();
      if (user == null) {
        throw invalidUserError(email);
      }
      if (!user.verified) {
        throw new UserInputError(`User "${email}" is not verified.`);
      }
      const populatedUser = await user.populate({
        path: "syndications",
        populate: {
          path: "lastSuccessfulComic",
        },
      }).execPopulate();
      const date = now();
      const comicsForEmail = populatedUser.syndications.map((syndication) => {
        const { title, lastSuccessfulComic } = syndication;
        const { imageUrl = null } = lastSuccessfulComic || {};
        const wasUpdated =
          lastSuccessfulComic == null ?
            false :
            moment(lastSuccessfulComic.date).isSame(date, "date");
        return {
          syndicationName: title,
          wasUpdated,
          imageUrl,
          // TODO(ecarrel): add image captions once we have support.
        };
      });
      const options = { sendAllComics, mentionNotUpdatedComics };
      return await sendComicEmail(email, comicsForEmail, options, date, populatedUser.googleAnalyticsHash);
    },
    emailAllUsers: async (_: any, args: {
      // Send all comics, regardless of if they were updated. Default: false.
      sendAllComics: boolean,
      // Mention comics that were not updated (as opposed to just omitting them from the email entirely). Default: true.
      mentionNotUpdatedComics: boolean,
      // Only email each user if we haven't already tried to send them an email today ("tried" means that we
      // looked to see if they deserved an email and sent them one if they did).
      onlyIfWeHaventCheckedToday: boolean,
    }) => {
      const {
        sendAllComics = false,
        mentionNotUpdatedComics = true,
        onlyIfWeHaventCheckedToday = true,
      } = args;
      let conditions: any = { verified: true };
      const date = now();
      if (onlyIfWeHaventCheckedToday) {
        conditions = {
          ...conditions,
          $or: [
            { lastEmailCheck: { $lt: date.startOf("day").toDate() } },
            { lastEmailCheck: null },
          ],
        };
      }
      const users = await User.find(conditions).exec();
      if (users == null) {
        throw new ApolloError("Could not find users");
      }
      const populatedUsers = await User.populate(users, {
        path: "syndications",
        populate: {
          path: "lastSuccessfulComic",
        },
      });
      const usersAndTheirComics =
        populatedUsers
        .map((populatedUser: IUser) => {
          const { email, googleAnalyticsHash, syndications = [] } = populatedUser;
          const comics = syndications.map((syndication: ISyndication) => {
            const { title, lastSuccessfulComic } = syndication;
            const { imageUrl = null } = lastSuccessfulComic || {};
            const wasUpdated =
              lastSuccessfulComic == null ?
                false :
                moment(lastSuccessfulComic.date).isSame(date, "date");
            return {
              syndicationName: title,
              wasUpdated,
              imageUrl,
              // TODO(ecarrel): add image captions once we have support.
            };
          });
          return {
            email,
            googleAnalyticsHash,
            comics,
          };
        });

      const options = { sendAllComics, mentionNotUpdatedComics };
      const emailResults = await Promise.all(usersAndTheirComics.map(
        ({ email, googleAnalyticsHash, comics }) =>
          sendComicEmail(email, comics, options, date, googleAnalyticsHash),
      ));
      const augmentedEmailResults = emailResults.map((emailResult, i) => ({
        user: populatedUsers[i],
        emailResult,
      }));
      const updatedUsers = augmentedEmailResults
        .filter((result) => result.emailResult === true)
        .map(({ user }) => {
          user.lastEmailCheck = date.toDate();
          return user;
        });
      if (updatedUsers.length > 0) {
        // TODO(ecarrel): batch this.
        await Promise.all(updatedUsers.map(
          (updatedUser) => updatedUser.save(),
        ));
      }
    },
  },
};
