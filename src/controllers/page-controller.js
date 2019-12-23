import FilmListComponent from '../components/film-list.js';
import ShowMoreComponent from '../components/show-more.js';
import FilmListExtra from '../components/film-list-extra.js';
import MovieControllerComponent from './movie-controller.js';
import {render, remove, RenderPosition} from '../utils/render.js';

const START_RENDER_FILMS_COUNT = 5;
const LOAD_MORE_RENDER_FILMS_COUNT = 5;
const RENDER_EXTRA_FILMS_COUNT = 2;

const renderFilms = (container, films, onDataChange, onViewChange) => {
  return films.map((film) => {
    const movieControllerComponent = new MovieControllerComponent(container, onDataChange, onViewChange);
    movieControllerComponent.render(film);
    return movieControllerComponent;
  });
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
    this._onViewChange = this._onViewChange.bind(this);

    this._showedMovieControllers = [];
  }

  render(films) {
    this._films = films;

    render(this._container.getElement(), this._filmListComponent, RenderPosition.BEFOREEND);
    render(this._container.getElement(), this._filmListTopRated, RenderPosition.BEFOREEND);
    render(this._container.getElement(), this._filmListMostCommented, RenderPosition.BEFOREEND);

    const allMoviesListElement = this._filmListComponent.getElement().querySelector(`.films-list__container`);

    let showingFilmsCount = START_RENDER_FILMS_COUNT;
    let showedFilms = renderFilms(allMoviesListElement, this._films.slice(0, showingFilmsCount), this._onDataChange, this._onViewChange);
    this._showedMovieControllers = this._showedMovieControllers.concat(showedFilms);

    const topRatedListFilms = this._films.slice().sort((a, b) => b.rating - a.rating).slice(0, RENDER_EXTRA_FILMS_COUNT);
    const topRatedListElement = this._filmListTopRated.getElement().querySelector(`.films-list__container`);
    showedFilms = renderFilms(topRatedListElement, topRatedListFilms.slice(0, RENDER_EXTRA_FILMS_COUNT), this._onDataChange, this._onViewChange);
    this._showedMovieControllers = this._showedMovieControllers.concat(showedFilms);

    const mostCommentedListFilms = this._films.slice().sort((a, b) => b.comments.length - a.comments.length).slice(0, RENDER_EXTRA_FILMS_COUNT);
    const mostCommentedListElement = this._filmListMostCommented.getElement().querySelector(`.films-list__container`);
    showedFilms = renderFilms(mostCommentedListElement, mostCommentedListFilms.slice(0, RENDER_EXTRA_FILMS_COUNT), this._onDataChange, this._onViewChange);
    this._showedMovieControllers = this._showedMovieControllers.concat(showedFilms);

    render(allMoviesListElement, this._showMoreComponent, RenderPosition.AFTEREND);

    this._showMoreComponent.setShowMoreClickHandler(() => {
      const prevShowingFilmsCount = showingFilmsCount;
      showingFilmsCount = prevShowingFilmsCount + LOAD_MORE_RENDER_FILMS_COUNT;
      showedFilms = renderFilms(allMoviesListElement, this._films.slice(prevShowingFilmsCount, showingFilmsCount), this._onDataChange, this._onViewChange);
      this._showedMovieControllers = this._showedMovieControllers.concat(showedFilms);

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

  _onViewChange() {
    this._showedMovieControllers.forEach((it) => it.setDefaultView());
  }
}
