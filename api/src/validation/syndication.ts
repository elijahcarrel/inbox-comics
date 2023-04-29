import { Syndication } from "../db-models/comic-syndication";

export const syndications = async () => {
    return Syndication.find({}).exec();
};

export const addSyndication = async (_: any, args: any) => {
    try {
        return await Syndication.create(args);
    } catch (e) {
        return (e as Error).message;
    }
};
