import { IUser, User } from "../db-models/user";
import { Syndication } from "../db-models/comic-syndication";

export const computePopularity = async () => {
  // Only look at real users (users with defined emails).
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore cannot assign $ne to null but appears to work?
  const users = await User.find({ email: { $exists: true, $ne: null } }).exec();
  const populatedUsers: IUser[] = await User.populate(users, [
    {
      path: "syndications",
    },
  ]);
  const syndications = await Syndication.find({}).exec();
  const counts = syndications.reduce(
    (memo: { [syndicationIdentifier: string]: number }, syndication) => ({
      // eslint-disable-next-line no-param-reassign
      ...memo,
      [syndication.identifier]: 0,
    }),
    {},
  );

  populatedUsers.forEach(({ syndications: userSyndications = [] }) => {
    userSyndications.forEach(({ identifier }) => {
      counts[identifier] += 1;
    });
  });

  // TODO(ecarrel): batch this.
  await Promise.all(
    syndications.map((syndication) => {
      // eslint-disable-next-line no-param-reassign
      syndication.numSubscribers = counts[syndication.identifier];
      return syndication.save();
    }),
  );

  return true;
};
