export const replaceAll = (str: string, search: string, replaceWith: string): string => {
    if (!str) {
        return str;
    }
    return str.split(search).join(replaceWith);
}