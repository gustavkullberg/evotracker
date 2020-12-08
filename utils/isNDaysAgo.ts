export const isNDaysAgo = (date: Date, nDays: number): boolean => {
    const day = 1000 * 60 * 60 * 24 * nDays;
    const dayAgo = Date.now() - day;
    return new Date(date).valueOf() > dayAgo;
};
