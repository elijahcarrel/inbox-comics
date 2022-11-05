import { ApolloError } from "apollo-server-errors";
import { Moment } from "moment";
import { FilterQuery, UpdateQuery } from "mongoose";
import { IUser, User } from "../../db-models/user";
import {
  ComicForEmail,
  sendComicEmail,
  SendComicEmailOptions,
} from "./templates/send-comic-email";
import { Email, IEmail } from "../../db-models/email";
import { EmailAllUsersOptions } from "../../api-models/email-options";
import { ISyndication } from "../../db-models/comic-syndication";

// TODO(ecarrel): clean up this type.
type UserAndComic = {
  email: string | null | undefined;
  googleAnalyticsHash: string;
  comics: {
    syndicationName: string;
    wasUpdated: boolean;
    imageUrl: string | null;
    imageCaption: string | null;
  }[];
};

// TODO(ecarrel): upgrade mongoose and then use these nicer types.
// type PopulatedUser = IUser & { _id: ObjectId };

type MessageId = string | null;

const isWorthSendingEmail = (
  comics: ComicForEmail[],
  options: SendComicEmailOptions,
) => {
  if (comics.length === 0) {
    return false;
  }
  if (options.sendAllComics) {
    return true;
  }
  return comics.some(({ wasUpdated }) => wasUpdated);
};

const parseComicsFromUsers = (populatedUsers: IUser[]): UserAndComic[] => {
  return populatedUsers.map((populatedUser: IUser) => {
    const {
      email,
      googleAnalyticsHash,
      syndications = [],
      lastEmailedComics = [],
    } = populatedUser;
    const comics = syndications.map((syndication: ISyndication) => {
      const { title, lastSuccessfulComic } = syndication;
      const { imageUrl = null, imageCaption = null } =
        lastSuccessfulComic || {};
      let wasUpdated = true;
      if (lastSuccessfulComic == null) {
        wasUpdated = false;
      } else {
        const comic = lastEmailedComics.find(
          (lastEmailedComic) =>
            // eslint-disable-next-line no-underscore-dangle
            String(lastEmailedComic.syndication) === String(syndication._id),
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
};

const sendEmailsForUsersAndTheirComics = async (
  usersAndTheirComics: UserAndComic[],
  sendComicEmailOptions: SendComicEmailOptions,
  date: Moment,
): Promise<MessageId[]> => {
  return Promise.all(
    usersAndTheirComics.map(({ email, googleAnalyticsHash, comics }) => {
      if (
        !isWorthSendingEmail(comics, sendComicEmailOptions) ||
        email == null
      ) {
        return Promise.resolve(null);
      }
      return sendComicEmail(
        email,
        comics,
        sendComicEmailOptions,
        date,
        googleAnalyticsHash,
      );
    }),
  );
};

// TODO(ecarrel): we can use lodash functions to clean up these maps.
const updateUserEntriesWithEmailedComics = async (
  savedEmails: IEmail[],
  messageIds: MessageId[],
  populatedUsers: IUser[],
  dateAsDate: Date,
) => {
  const messageIdToSavedEmail = savedEmails.reduce((memo, savedEmail) => {
    return {
      ...memo,
      [savedEmail.messageId]: savedEmail,
    };
  }, {} as Record<string, IEmail>);

  const augmentedEmailResults = messageIds.map((messageId, i) => ({
    user: populatedUsers[i],
    savedEmail: messageId ? messageIdToSavedEmail[messageId] : undefined,
  }));

  const updatedUsers = augmentedEmailResults.map(({ user, savedEmail }) => {
    // eslint-disable-next-line no-param-reassign
    user.lastEmailedComics = user.syndications
      .map((syndication) => syndication.lastSuccessfulComic)
      .filter((comic) => comic != null);
    // eslint-disable-next-line no-param-reassign
    user.lastEmailCheck = dateAsDate;
    if (savedEmail) {
      // eslint-disable-next-line no-param-reassign
      user.lastEmailSent = dateAsDate;
      // eslint-disable-next-line no-param-reassign
      user.emails = [...(user.emails || []), savedEmail];
    }
    return user;
  });
  if (updatedUsers.length > 0) {
    // TODO(ecarrel): batch this.
    await Promise.all(updatedUsers.map((updatedUser) => updatedUser.save()));
  }
};

const markAllUsersAsChecked = async (users: IUser[], dateAsDate: Date) => {
  const updateDoc: UpdateQuery<IUser> = {
    $set: {
      lastEmailCheck: dateAsDate,
    },
  };
  const filter: FilterQuery<IUser> = {
    // eslint-disable-next-line no-underscore-dangle
    _id: users.map((user) => user._id),
  };
  await User.updateMany(filter, updateDoc);
};

export const emailUsers = async (
  users: IUser[],
  options: EmailAllUsersOptions,
  date: Moment,
) => {
  const { sendAllComics = false, mentionNotUpdatedComics = true } = options;
  const populatedUsers: IUser[] = await User.populate(users, [
    {
      path: "syndications",
      populate: {
        path: "lastSuccessfulComic",
      },
    },
    {
      path: "lastEmailedComics",
    },
  ]);

  const usersAndTheirComics = parseComicsFromUsers(populatedUsers);

  // Before attempting to send emails, we mark users as checked in the database.
  // This helps us avoid a failure mode in which database reads are slow, causing
  // timeouts which result in dozens/hundreds of emails sent to the same users.
  // In effect, we are deciding that it's better to skip a user than to email them
  // twice. Future engineering work could make it so that we don't have to decide
  // between these two choices, but this is the best trade-off for now.
  const dateAsDate = date.toDate();
  await markAllUsersAsChecked(populatedUsers, dateAsDate);

  const sendComicEmailOptions: SendComicEmailOptions = {
    sendAllComics,
    mentionNotUpdatedComics,
  };
  const messageIds: MessageId[] = await sendEmailsForUsersAndTheirComics(
    usersAndTheirComics,
    sendComicEmailOptions,
    date,
  );

  const savedEmails = await Email.insertMany(
    messageIds
      .filter((messageId) => messageId)
      .map((messageId) => ({
        messageId: messageId as string,
        sendTime: dateAsDate,
      })),
  );

  await updateUserEntriesWithEmailedComics(
    savedEmails,
    messageIds,
    populatedUsers,
    dateAsDate,
  );

  return messageIds;
};

export const emailAllUsers = async (
  date: Moment,
  options: EmailAllUsersOptions = {},
) => {
  const { onlyIfWeHaventCheckedToday = true, limit = 50 } = options;
  let conditions: any = {
    verified: true,
    enabled: true,
    email: { $exists: true, $ne: null },
  };
  if (onlyIfWeHaventCheckedToday) {
    conditions = {
      ...conditions,
      $or: [
        { lastEmailCheck: { $lt: date.clone().startOf("day").toDate() } },
        { lastEmailCheck: null },
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
  return emailUsers(users, options, date);
};
