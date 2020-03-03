export const StatisticsType = {
  ALL: `all-time`,
  TODAY: `today`,
  WEEK: `week`,
  MONTS: `month`,
  YEAR: `year`
};

export const filterComments = (comments) => {
  return comments.filter((comment) => comment.state !== `deleted`);
};
