import moment from "moment-timezone";

const TIMEZONE = "America/Los_Angeles";
export const now = () => moment().tz(TIMEZONE);
