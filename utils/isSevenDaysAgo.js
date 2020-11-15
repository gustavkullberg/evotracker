export const isSevenDaysAgo = date => {
  const day = 1000 * 60 * 60 * 24 * 7;
  const dayAgo = Date.now() - day;
  return new Date(date) > dayAgo;
};
