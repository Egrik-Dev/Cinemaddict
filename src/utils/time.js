import moment from 'moment';

const MINUTES_IN_HOURS = 60;

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

export const commentDate = (date) => {
  return moment(date).format(`YYYY/MM/DD HH:mm`);
};

export const getDateFrom = (period) => {
  switch (period) {
    case `today`:
      return moment(moment().startOf(`day`)).format();
    case `week`:
      return moment(moment().subtract(7, `days`)).format();
    case `month`:
      return moment(moment().subtract(1, `months`)).format();
    case `year`:
      return moment(moment().subtract(1, `years`)).format();
    default:
      return period;
  }
};

export const parseToJson = (date) => moment(date).toJSON();
