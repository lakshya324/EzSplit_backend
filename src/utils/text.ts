export const replaceSpaceWithHyphenWithLowerCase = (value: string) => {
  return value.replace(/ /g, "-").toLowerCase();
};

export const replaceHyphenWithSpaceWithCapitalized = (value: string) => {
  return value
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

export const unixToUTC = (unix: number) => {
  return new Date(unix * 1000).toUTCString();
};

export const unixToDate = (unix: number) => {
  return new Date(unix * 1000);
};

export const dateToUnix = (date: Date) => {
  return Math.floor(date.getTime() / 1000);
};
