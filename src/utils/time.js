import moment from 'moment';

const MINUTES_IN_HOURS = 60;

const CommentTime = {
  NOW: `now`,
  MINUTE_AGO: `a minute ago`,
  FEW_MINUTES_AGO: `a few minutes ago`,
  HOUR_AGO: `a hour ago`,
  FEW_HOURS_AGO: `a few hours ago`
};

const PeriodTime = {
  TODAY: `today`,
  WEEK: `week`,
  MONTH: `month`,
  YEAR: `year`
};

const MinutesIntervals = {
  NOW_FROM: 1,
  NOW_TO: 3,
  MINUTE_AGO_FROM: 4,
  MINUTE_AGO_TO: 59,
  FEW_MINUTES_AGO_FROM: 60,
  FEW_MINUTES_AGO_TO: 119,
  HOUR_AGO_FROM: 120,
  HOUR_AGO_TO: 1439
};

export const formatYear = (date) => {
  return moment(date).format(`YYYY`);
};

export const formatDuration = (runtime) => {
  const time = moment.duration(runtime, `m`);
  const hours = moment.duration(time).hours();
  const minutes = moment.duration(time).minutes();
  return `${hours}h ${minutes}m`;
};

export const getTotalHours = (runtime) => {
  return Math.floor(runtime / MINUTES_IN_HOURS);
};

export const getRestOfMinutes = (runtime) => {
  return runtime % MINUTES_IN_HOURS;
};

export const formatReleaseDate = (date) => {
  return moment(date).format(`D MMMM YYYY`);
};

export const getDateFrom = (period) => {
  switch (period) {
    case PeriodTime.TODAY:
      return moment(moment().startOf(`day`)).format();
    case PeriodTime.WEEK:
      return moment(moment().subtract(7, `days`)).format();
    case PeriodTime.MONTH:
      return moment(moment().subtract(1, `months`)).format();
    case PeriodTime.YEAR:
      return moment(moment().subtract(1, `years`)).format();
    default:
      return period;
  }
};

export const parseToJson = (date) => moment(date).toJSON();

export const commentDate = (date) => {
  const now = Date.now();
  const diff = moment(now).diff(date, `minutes`);
  if (diff === 0) {
    return CommentTime.NOW;
  } else if (diff >= MinutesIntervals.NOW_FROM && diff <= MinutesIntervals.NOW_TO) {
    return CommentTime.MINUTE_AGO;
  } else if (diff >= MinutesIntervals.MINUTE_AGO_FROM && diff <= MinutesIntervals.MINUTE_AGO_TO) {
    return CommentTime.FEW_MINUTES_AGO;
  } else if (diff >= MinutesIntervals.FEW_MINUTES_AGO_FROM && diff <= MinutesIntervals.FEW_MINUTES_AGO_TO) {
    return CommentTime.HOUR_AGO;
  } else if (diff >= MinutesIntervals.HOUR_AGO_FROM && diff <= MinutesIntervals.HOUR_AGO_TO) {
    return CommentTime.FEW_HOURS_AGO;
  } else {
    return moment(date).fromNow();
  }
};
