export const isOneDayAgo = (date: Date): boolean => {
  const day = 1000 * 60 * 60 * 24;
  const dayAgo = Date.now() - day;
  return new Date(date).valueOf() > dayAgo;
};
