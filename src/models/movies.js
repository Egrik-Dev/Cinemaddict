import {FilterType} from '../utils/const';
import {getMoviesByFilter} from '../utils/filters';

export default class Movies {
  constructor() {
    this._films = [];

    this._activeFilterType = FilterType.ALL;

    this._filterChangeHandlers = [];
    this._dataChangeHandlers = [];
  }

  getFilms() {
    return getMoviesByFilter(this._films, this._activeFilterType);
  }

  getFilmsAll() {
    return this._films;
  }

  setFilms(films) {
    this._films = Array.from(films);
  }

  setFilter(filterType) {
    this._activeFilterType = filterType;
    this._filterChangeHandlers.forEach((handler) => handler());
  }

  updateFilms(id, film) {
    const index = this._films.findIndex((movie) => movie.id === id);

    if (index === -1) {
      return false;
    }

    this._films = [].concat(this._films.slice(0, index), film, this._films.slice(index + 1));

    this._callHandlers(this._dataChangeHandlers);

    return true;
  }

  deleteComment(id, film) {
    const idFilm = film.id;
    const indexFilm = this._films.findIndex((movie) => movie.id === idFilm);

    if (indexFilm === -1) {
      return false;
    }

    const indexComment = this._films[indexFilm].comments.findIndex((comment) => comment.id === Number(id));
    this._films[indexFilm].comments = [].concat(this._films[indexFilm].comments.slice(0, indexComment), this._films[indexFilm].comments.slice(indexComment + 1));

    return true;
  }

  addComment(idFilm, comment) {
    const indexFilm = this._films.findIndex((movie) => movie.id === idFilm);

    if (indexFilm === -1) {
      return false;
    }

    this._films[indexFilm].comments.push(comment);

    return true;
  }

  setFilterClickHandler(handler) {
    this._filterChangeHandlers.push(handler);
  }

  setDataChangeHandler(handler) {
    this._dataChangeHandlers.push(handler);
  }

  _callHandlers(handlers) {
    handlers.forEach((handler) => handler());
  }
}
