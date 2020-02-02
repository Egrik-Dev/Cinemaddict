export const MenuType = {
  FILTER: `filter`,
  STATS: `stats`
};

export const FilterType = {
  ALL: `All movies`,
  WATCHLIST: `Watchlist`,
  HISTORY: `History`,
  FAVORITES: `Favorites`,
};

const SortType = {
  RATING: `Rating`,
  DATE: `Date`
};

const START_COUNT_FILMS = 1;

const ALL_TIME_FILMS = `all-time`;

export const getWatchlistFilms = (films) => {
  return films.filter((film) => film.watchlist);
};

export const getHistoryFilms = (films) => {
  return films.filter((film) => film.alreadyWatched);
};

export const getFavoritesFilms = (films) => {
  return films.filter((film) => film.favorite);
};

export const getMoviesByFilter = (films, filterType) => {
  switch (filterType) {
    case FilterType.WATCHLIST:
      return getWatchlistFilms(films);
    case FilterType.HISTORY:
      return getHistoryFilms(films);
    case FilterType.FAVORITES:
      return getFavoritesFilms(films);
  }

  return films;
};

export const getMoviesBySort = (films, sortType) => {
  switch (sortType) {
    case SortType.RATING:
      return films.slice().sort((a, b) => b.totalRating - a.totalRating);
    case SortType.DATE:
      return films.slice().sort((a, b) => Date.parse(b.release.date) - Date.parse(a.release.date));
  }

  return films;
};

export const getMoviesByStatistic = (films, dateFrom) => {
  const watchedFilms = films.slice().filter((film) => film.alreadyWatched);
  return (dateFrom === ALL_TIME_FILMS) ? watchedFilms : watchedFilms.filter((film) => film.watchingDate > dateFrom);
};

export const getGenresList = (films) => {
  const genres = {};
  films.forEach((film) => {
    film.genre.forEach((genre) => {
      if (genre in genres) {
        genres[genre]++;
      } else {
        genres[genre] = START_COUNT_FILMS;
      }
    });
  });

  return Object.entries(genres).sort((a, b) => b[1] - a[1]);
};
