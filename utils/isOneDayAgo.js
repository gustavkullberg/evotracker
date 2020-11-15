export const isOneDayAgo = date => {
  const day = 1000 * 60 * 60 * 24;
  const dayAgo = Date.now() - day;
  return new Date(date) > dayAgo;
};
