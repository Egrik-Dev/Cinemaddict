import {FilterType} from '../utils/const';

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
