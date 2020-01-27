export const MenuType = {
  FILTER: `filter`,
  STATS: `stats`
};

export const FilterType = {
  ALL: `all`,
  WATCHLIST: `watchlist`,
  HISTORY: `history`,
  FAVORITES: `favorites`,
};

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
    case `Rating`:
      return films.slice().sort((a, b) => b.totalRating - a.totalRating);
    case `Date`:
      return films.slice().sort((a, b) => Date.parse(b.release.date) - Date.parse(a.release.date));
  }

  return films;
};

export const getMoviesByStatistic = (films, dateFrom) => {
  const watchedFilms = films.slice().filter((film) => film.alreadyWatched);
  return (dateFrom === `all-time`) ? watchedFilms : watchedFilms.filter((film) => film.watchingDate > dateFrom);
};

export const getGenresList = (films) => {
  const START_COUNT_FILMS = 0;
  const genres = {};
  films.forEach((film) => {
    film.genre.forEach((genre) => {
      if (genre in genres) {
        genres[genre]++;
      } else {
        genres[genre] = START_COUNT_FILMS;
        genres[genre]++;
      }
    });
  });

  return Object.entries(genres).sort((a, b) => b[1] - a[1]);
};
