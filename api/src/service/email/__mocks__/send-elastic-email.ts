import { v4 as uuidv4 } from "uuid";

export const sendElasticEmail = async (
    _to: string,
    _subject: string,
    _body: string,
    _fromEmail?: string,
) => {
    const messageId = uuidv4();
    return messageId;
};
