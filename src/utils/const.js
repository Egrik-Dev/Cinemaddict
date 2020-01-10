export const Months = {
  '0': `January`,
  '1': `February`,
  '2': `March`,
  '3': `April`,
  '4': `May`,
  '5': `June`,
  '6': `July`,
  '7': `August`,
  '8': `September`,
  '9': `October`,
  '10': `November`,
  '11': `December`,
};

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

export const getDuration = (duration) => {
  const HOUR_IN_MINUTES = 60;
  const hours = Math.round(duration / HOUR_IN_MINUTES);
  const minutes = duration % HOUR_IN_MINUTES;
  return `${hours > 0 ? `${hours}h ` : ``}${minutes}m`;
};
