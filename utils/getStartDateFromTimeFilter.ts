export const getStartDateFromTimeFilter = (timeFilter: string): Date => {
    const date = new Date();
    if (timeFilter === '1D') {
        date.setDate(date.getDate() - 1);
        return date;
    }
    else if (timeFilter === "7D") {
        date.setDate(date.getDate() - 7);
        return date;
    }
    else if (timeFilter === '10D') {
        date.setDate(date.getDate() - 10);
        return date;
    } else {
        date.setDate(date.getDate() - 1);
        return new Date(0);
    }
}