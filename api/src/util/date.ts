import moment from "moment-timezone";

const TIMEZONE = "America/New_York";
export const now = () => moment().tz(TIMEZONE);
