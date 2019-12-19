// import FilmComponent from '../components/film-card.js';
// import PopUpComponent from '../components/popup.js';
import FilmListComponent from '../components/film-list.js';
import ShowMoreComponent from '../components/show-more.js';
import FilmListExtra from '../components/film-list-extra.js';
import MovieControllerComponent from './movie-controller.js';
// import {isEscEvent} from '../utils.js';
import {render, remove, RenderPosition} from '../utils/render.js';

const START_RENDER_FILMS_COUNT = 5;
const LOAD_MORE_RENDER_FILMS_COUNT = 5;
const RENDER_EXTRA_FILMS_COUNT = 2;

const renderFilm = (film, container, onDataChange) => {
  const movieControllerComponent = new MovieControllerComponent(container, onDataChange);
  movieControllerComponent.render(film);

  // return movieControllerComponent;
};

export default class PageController {
  constructor(container) {
    this._container = container;

    this._films = [];
    this._filmListComponent = new FilmListComponent();
    this._showMoreComponent = new ShowMoreComponent();
    this._filmListTopRated = new FilmListExtra(`Top rated`);
    this._filmListMostCommented = new FilmListExtra(`Most commented`);
    this._onDataChange = this._onDataChange.bind(this);
  }

  render(films) {
    this._films = films;

    render(this._container.getElement(), this._filmListComponent, RenderPosition.BEFOREEND);
    render(this._container.getElement(), this._filmListTopRated, RenderPosition.BEFOREEND);
    render(this._container.getElement(), this._filmListMostCommented, RenderPosition.BEFOREEND);

    const allMoviesListElement = this._filmListComponent.getElement().querySelector(`.films-list__container`);

    let showingFilmsCount = START_RENDER_FILMS_COUNT;
    this._films.slice(0, showingFilmsCount).forEach((film) => renderFilm(film, allMoviesListElement, this._onDataChange));

    const topRatedListFilms = this._films.slice().sort((a, b) => b.rating - a.rating).slice(0, RENDER_EXTRA_FILMS_COUNT);
    const topRatedListElement = this._filmListTopRated.getElement().querySelector(`.films-list__container`);
    topRatedListFilms.slice(0, RENDER_EXTRA_FILMS_COUNT).forEach((film) => renderFilm(film, topRatedListElement, this._onDataChange));

    const mostCommentedListFilms = this._films.slice().sort((a, b) => b.comments.length - a.comments.length).slice(0, RENDER_EXTRA_FILMS_COUNT);
    const mostCommentedListElement = this._filmListMostCommented.getElement().querySelector(`.films-list__container`);
    mostCommentedListFilms.slice(0, RENDER_EXTRA_FILMS_COUNT).forEach((film) => renderFilm(film, mostCommentedListElement, this._onDataChange));

    render(allMoviesListElement, this._showMoreComponent, RenderPosition.AFTEREND);

    this._showMoreComponent.setShowMoreClickHandler(() => {
      const prevShowingFilmsCount = showingFilmsCount;
      showingFilmsCount = prevShowingFilmsCount + LOAD_MORE_RENDER_FILMS_COUNT;
      this._films.slice(prevShowingFilmsCount, showingFilmsCount).forEach((film) => renderFilm(film, allMoviesListElement, this._onDataChange));

      if (showingFilmsCount >= films.length) {
        remove(this._showMoreComponent);
      }
    });
  }

  _onDataChange(movieController, oldData, newData) {
    const index = this._films.findIndex((film) => film === oldData);

    this._films = [].concat(this._films.slice(0, index), newData, this._films.slice(index + 1));

    movieController.render(this._films[index]);
  }
}
