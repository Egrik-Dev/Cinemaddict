import {createElement} from '../utils.js';

const filteredFilms = (films, prop) => films.filter((film) => film[prop]);

const createMenuTemplate = (films) => {
  const inWatchlist = filteredFilms(films, `watchlist`).length;
  const inHistorylist = filteredFilms(films, `watched`).length;
  const inFavoriteslist = filteredFilms(films, `favorite`).length;
  return (`<nav class="main-navigation">
      <a href="#all" class="main-navigation__item main-navigation__item--active">All movies</a>
      <a href="#watchlist" class="main-navigation__item">Watchlist <span class="main-navigation__item-count">${inWatchlist}</span></a>
      <a href="#history" class="main-navigation__item">History <span class="main-navigation__item-count">${inHistorylist}</span></a>
      <a href="#favorites" class="main-navigation__item">Favorites <span class="main-navigation__item-count">${inFavoriteslist}</span></a>
      <a href="#stats" class="main-navigation__item main-navigation__item--additional">Stats</a>
    </nav>
    <ul class="sort">
      <li><a href="#" class="sort__button sort__button--active">Sort by default</a></li>
      <li><a href="#" class="sort__button">Sort by date</a></li>
      <li><a href="#" class="sort__button">Sort by rating</a></li>
    </ul>`);
};

export default class Menu {
  constructor(films) {
    this._films = films;
    this._element = null;
  }

  getTemplate() {
    return createMenuTemplate(this._films);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
