export const getUpdateSubscriptionsUrl = (email: string) =>
  `${process.env.domain}/user?email=${encodeURIComponent(email)}`;

export const getUnsubscribeUrl = (email: string) =>
  `${process.env.domain}/user/unsubscribe?email=${encodeURIComponent(email)}`;
