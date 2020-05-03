import { Syndication } from "../db-models/syndication";
import { IUser, User } from "../db-models/user";

export const computePopularity = async () => {
  // Only look at real users (users with defined emails).
  // @ts-ignore cannot assign $ne to null but appears to work?
  const users = await User.find({ email: { $exists: true, $ne: null } }).exec();
  const populatedUsers: IUser[] = await User.populate(users, [{
    path: "syndications",
  }]);
  const syndications = await Syndication.find({}).exec();
  const counts = syndications.reduce((accumulatorObject: { [syndicationIdentifier: string]: number }, syndication) => {
    accumulatorObject[syndication.identifier] = 0;
    return accumulatorObject;
  }, {});

  populatedUsers.forEach(({ syndications: userSyndications = [] }) => {
    userSyndications.forEach(({ identifier }) => {
      counts[identifier] += 1;
    });
  });

  // TODO(ecarrel): batch this.
  await Promise.all(syndications.map((syndication) => {
    syndication.numSubscribers = counts[syndication.identifier];
    return syndication.save();
  }));

  return true;
};
