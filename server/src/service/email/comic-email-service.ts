import { ApolloError } from "apollo-server-errors";
import { Moment } from "moment";
import moment from "moment-timezone";
import { ISyndication } from "../../models/syndication";
import { IUser, User } from "../../models/user";
import { EmailAllUsersOptions } from "../../router/email";
import { sendComicEmail } from "./templates/send-comic-email";

export const emailUsers = async (users: IUser[], emailAllUsersOptions: EmailAllUsersOptions, date: Moment) => {
  const {
    sendAllComics = false,
    mentionNotUpdatedComics = true,
  } = emailAllUsersOptions;
  const populatedUsers = await User.populate(users, {
    path: "syndications",
    populate: {
      path: "lastSuccessfulComic",
    },
  });
  const usersAndTheirComics =
    populatedUsers
    .map((populatedUser: IUser) => {
      const {email, googleAnalyticsHash, syndications = []} = populatedUser;
      const comics = syndications.map((syndication: ISyndication) => {
        const {title, lastSuccessfulComic} = syndication;
        const {imageUrl = null} = lastSuccessfulComic || {};
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

  const options = {sendAllComics, mentionNotUpdatedComics};
  const emailResults = await Promise.all(usersAndTheirComics.map(
    ({email, googleAnalyticsHash, comics}) =>
      sendComicEmail(email, comics, options, date, googleAnalyticsHash),
  ));
  const augmentedEmailResults = emailResults.map((emailResult, i) => ({
    user: populatedUsers[i],
    emailResult,
  }));
  const updatedUsers = augmentedEmailResults
  .filter((result) => result.emailResult === true)
  .map(({user}) => {
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
export const emailAllUsers = async (date: Moment, emailAllUsersOptions: EmailAllUsersOptions = {}) => {
  const {
    onlyIfWeHaventCheckedToday = true,
  } = emailAllUsersOptions;
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
  const users = await User.find(conditions).exec();
  if (users == null) {
    throw new ApolloError("Could not find users");
  }
  return await emailUsers(users, emailAllUsersOptions, date);
};
