import moment from 'moment';

export const formatYear = (date) => {
  return moment(date).format(`YYYY`);
};

export const formatDuration = (runtime) => {
  const time = moment.duration(runtime, `m`);
  const hours = moment.duration(time).hours();
  const minutes = moment.duration(time).minutes();
  return `${hours}h ${minutes}m`;
};

export const formatReleaseDate = (date) => {
  return moment(date).format(`D MMMM YYYY`);
};

export const commentDate = (date) => {
  return moment(date).format(`YYYY/MM/DD HH:mm`);
};

