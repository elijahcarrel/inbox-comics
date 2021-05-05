import moment from "moment-timezone";
import { UserInputError } from "apollo-server-micro";

export const TIMEZONE = "America/New_York";
export const now = (): moment.Moment => moment().tz(TIMEZONE);

export const validateComicDeliveryTime = (
  comicDeliveryHoursInNewYork: number,
  comicDeliveryMinutesInNewYork: number,
): [hour: number, minutes: number] => {
  if (!Number.isInteger(comicDeliveryHoursInNewYork)) {
    throw new UserInputError(
      `Invalid comic delivery time; hour is not an integer.`,
    );
  }
  if (!Number.isInteger(comicDeliveryMinutesInNewYork)) {
    throw new UserInputError(
      `Invalid comic delivery time; minutes is not an integer.`,
    );
  }
  if (comicDeliveryHoursInNewYork < 0) {
    throw new UserInputError(
      `Invalid comic delivery time; hour is less than 0`,
    );
  }
  if (comicDeliveryHoursInNewYork >= 0 && comicDeliveryHoursInNewYork < 6) {
    throw new UserInputError(
      `Cannot set comic delivery time earlier than 3 AM PT / 6 AM ET.`,
    );
  }
  if (comicDeliveryHoursInNewYork >= 24) {
    throw new UserInputError(
      `Invalid comic delivery time; hour is greater than or equal to 24`,
    );
  }
  if (comicDeliveryMinutesInNewYork < 0) {
    throw new UserInputError(
      `Invalid comic delivery time; minute is less than 0`,
    );
  }
  if (comicDeliveryMinutesInNewYork >= 60) {
    throw new UserInputError(
      `Invalid comic delivery time; minute is greater than or equal to 60`,
    );
  }
  return [comicDeliveryHoursInNewYork, comicDeliveryMinutesInNewYork];
};
