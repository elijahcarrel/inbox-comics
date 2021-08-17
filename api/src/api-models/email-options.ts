export interface EmailAllUsersOptions {
  // Send all comics, regardless of if they were updated. Default: false.
  sendAllComics?: boolean;
  // Limit to a max number of emails. 0 results in no limit. Default: 50.
  limit?: number;
  // Mention comics that were not updated (as opposed to just omitting them from the email entirely). Default: true.
  mentionNotUpdatedComics?: boolean;
  // Only email each user if we haven't already tried to send them an email today ("tried" means that we
  // looked to see if they deserved an email and sent them one if they did). Default: true.
  onlyIfWeHaventCheckedToday?: boolean;
}

export interface CancelThrottledEmailsOptions {
  // Limit to a max number of emails. 0 results in no limit. Default: 3.
  limit?: number;
}
