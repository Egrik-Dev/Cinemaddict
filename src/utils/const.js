export const FilterType = {
  ALL: `all`,
  WATCHLIST: `watchlist`,
  HISTORY: `history`,
  FAVORITES: `favorites`,
};

export const createSecondSign = (unit) => {
  let num = String(unit).split(``);
  num.unshift(`0`);
  return num
    .slice(-2)
    .join(``);
};

export const generateDateNow = () => {
  let date = new Date();
  return `${date.getFullYear()}-${date.getMonth() + 1}-${createSecondSign(date.getDate())}T${createSecondSign(date.getHours())}:${createSecondSign(date.getMinutes())}:${createSecondSign(date.getSeconds())}.${date.getMilliseconds()}Z`;
};
