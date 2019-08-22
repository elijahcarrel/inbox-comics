import { ApolloError } from "apollo-server-errors";
import { Moment } from "moment";
import { ISyndication } from "../../models/syndication";
import { IUser, User } from "../../models/user";
import { EmailAllUsersOptions } from "../../router/email";
import { sendComicEmail } from "./templates/send-comic-email";

export const emailUsers = async (users: IUser[], options: EmailAllUsersOptions, date: Moment) => {
  const {
    sendAllComics = false,
    mentionNotUpdatedComics = true,
  } = options;
  const populatedUsers = await User.populate(users, [{
    path: "syndications",
    populate: {
      path: "lastSuccessfulComic",
    },
  }, {
    path: "lastEmailedComics",
  }]);
  const usersAndTheirComics =
    populatedUsers
    .map((populatedUser: IUser) => {
      const { email, googleAnalyticsHash, syndications = [], lastEmailedComics } = populatedUser;
      const comics = syndications.map((syndication: ISyndication) => {
        const { title, lastSuccessfulComic } = syndication;
        const { imageUrl = null, imageCaption = null } = lastSuccessfulComic || {};
        let wasUpdated = false;
        if (lastSuccessfulComic == null) {
          wasUpdated = false;
        } else {
          const comic = lastEmailedComics.find(
            ({ syndication: { identifier } }) => identifier === syndication.identifier,
          );
          if (comic != null) {
            wasUpdated = comic.imageUrl !== imageUrl;
          }
        }
        return {
          syndicationName: title,
          wasUpdated,
          imageUrl,
          imageCaption,
        };
      });
      return {
        email,
        googleAnalyticsHash,
        comics,
      };
    });

  const sendComicEmailOptions = { sendAllComics, mentionNotUpdatedComics };
  const emailResults = await Promise.all(usersAndTheirComics.map(
    ({email, googleAnalyticsHash, comics}) =>
      sendComicEmail(email, comics, sendComicEmailOptions, date, googleAnalyticsHash),
  ));
  const augmentedEmailResults = emailResults.map((emailResult, i) => ({
    user: populatedUsers[i],
    emailResult,
  }));
  const updatedUsers = augmentedEmailResults
  .filter((result) => result.emailResult === true)
  .map(({ user }) => {
    user.lastEmailedComics = user.syndications.map((syndication) => syndication.lastSuccessfulComic);
    user.lastEmailCheck = date.toDate();
    return user;
  });
  if (updatedUsers.length > 0) {
    // TODO(ecarrel): batch this.
    await Promise.all(updatedUsers.map(
      (updatedUser) => updatedUser.save(),
    ));
  }
  // TODO(ecarrel): return something?
};

export const emailAllUsers = async (date: Moment, options: EmailAllUsersOptions = {}) => {
  const {
    onlyIfWeHaventCheckedToday = true,
    limit = 50,
  } = options;
  let conditions: any = {verified: true};
  if (onlyIfWeHaventCheckedToday) {
    conditions = {
      ...conditions,
      $or: [
        {lastEmailCheck: {$lt: date.startOf("day").toDate()}},
        {lastEmailCheck: null},
      ],
    };
  }
  let usersRequest = User.find(conditions);
  if (limit !== 0) {
    usersRequest = usersRequest.limit(limit);
  }
  const users = await usersRequest.exec();
  if (users == null) {
    throw new ApolloError("Could not find users");
  }
  return await emailUsers(users, options, date);
};
