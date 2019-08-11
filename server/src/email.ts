import { gql } from "apollo-server-micro";
import moment from "moment-timezone";
import { sendComicEmail } from "./email/send-comic-email";
import { User } from "./user";
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
      const { email, sendAllComics = false, mentionNotUpdatedComics = true } = args;
      const user = await User.findOne({ email }).exec();
      if (user == null) {
        throw invalidUserError(email);
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
  },
};
