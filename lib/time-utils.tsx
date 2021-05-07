import {
  format,
  getTimezoneOffset as dateFnsGetTimezoneOffset,
} from "date-fns-tz";

export const getFormattedComicDeliveryTime = (
  comicDeliveryHoursInNewYork = 6,
  comicDeliveryMinutesInNewYork = 0,
): string => {
  // Actual date doesn't matter, just time.
  const comicDeliveryTime = new Date(
    `January 1, 1980 ${comicDeliveryHoursInNewYork}:${comicDeliveryMinutesInNewYork}:00 EST`,
  );
  return format(comicDeliveryTime, "h:mm a z");
};

const getNewYorkToLocalTimeZoneOffsetInMinutes = (): number => {
  const now = new Date();
  const localOffsetMinutes = -now.getTimezoneOffset();
  const newYorkOffsetMs = dateFnsGetTimezoneOffset("America/New_York", now);
  const newYorkOffsetMinutes = Math.floor(newYorkOffsetMs / (60 * 1000));
  return newYorkOffsetMinutes - localOffsetMinutes;
};

export const comicDeliveryTimeInNewYorkToLocalTimeZone = (
  comicDeliveryHoursInNewYork = 6,
  comicDeliveryMinutesInNewYork = 0,
): [
  comicDeliveryHoursInLocalTimeZone: number,
  comicDeliveryMinutesInLocalTimeZone: number,
] => {
  const offset = getNewYorkToLocalTimeZoneOffsetInMinutes();
  const minutesOffset = offset % 60;
  const hoursOffset = (offset - minutesOffset) / 60;
  return [
    (comicDeliveryHoursInNewYork - hoursOffset) % 24,
    comicDeliveryMinutesInNewYork - minutesOffset,
  ];
};

export const comicDeliveryTimeInLocalTimeZoneToNewYork = (
  comicDeliveryHoursInLocalTimeZone = 6,
  comicDeliveryMinutesInLocalTimeZone = 0,
): [
  comicDeliveryHoursInNewYork: number,
  comicDeliveryMinutesInNewYork: number,
] => {
  const offset = -getNewYorkToLocalTimeZoneOffsetInMinutes();
  const minutesOffset = offset % 60;
  const hoursOffset = (offset - minutesOffset) / 60;
  return [
    (comicDeliveryHoursInLocalTimeZone - hoursOffset) % 24,
    comicDeliveryMinutesInLocalTimeZone - minutesOffset,
  ];
};
