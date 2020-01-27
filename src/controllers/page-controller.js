import FilmListComponent from '../components/film-list.js';
import ShowMoreComponent from '../components/show-more.js';
import FilmListExtra from '../components/film-list-extra.js';
import NoFilmsComponent from '../components/no-films';
import MovieControllerComponent from './movie-controller.js';
import {render, remove, RenderPosition} from '../utils/render.js';

const START_RENDER_FILMS_COUNT = 5;
const LOAD_MORE_RENDER_FILMS_COUNT = 5;
const RENDER_EXTRA_FILMS_COUNT = 2;

const renderFilms = (container, films, onDataChange, onViewChange, api) => {
  return films.map((film) => {
    const movieControllerComponent = new MovieControllerComponent(container, onDataChange, onViewChange, api);
    movieControllerComponent.render(film);
    return movieControllerComponent;
  });
};

export default class PageController {
  constructor(container, moviesModel, api) {
    this._container = container;
    this._moviesModel = moviesModel;
    this._api = api;

    this._films = [];

    this._filmListComponent = new FilmListComponent();
    this._filmListTopRated = new FilmListExtra(`Top rated`);
    this._filmListMostCommented = new FilmListExtra(`Most commented`);
    this._showMoreComponent = new ShowMoreComponent();

    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    this._onFilterSortChange = this._onFilterSortChange.bind(this);

    this._allMoviesListElement = null;

    this._moviesModel.setFilterClickHandler(this._onFilterSortChange);
    this._moviesModel.setSortClickHandler(this._onFilterSortChange);

    this._showedMovieControllers = [];
    this._showingMoviesCount = START_RENDER_FILMS_COUNT;
  }

  render() {
    this._films = this._moviesModel.getFilmsAll();

    render(this._container.getElement(), this._filmListComponent, RenderPosition.BEFOREEND);
    this._allMoviesListElement = this._filmListComponent.getElement().querySelector(`.films-list__container`);

    if (this._films.length === 0) {
      const noFilmsComponent = new NoFilmsComponent();
      render(this._allMoviesListElement, noFilmsComponent, RenderPosition.AFTEREND);
    } else {
      render(this._container.getElement(), this._filmListTopRated, RenderPosition.BEFOREEND);
      render(this._container.getElement(), this._filmListMostCommented, RenderPosition.BEFOREEND);

      this._renderMainFilms(this._films.slice(0, this._showingMoviesCount));

      const topRatedListFilms = this._films.slice().sort((a, b) => b.totalRating - a.totalRating).slice(0, RENDER_EXTRA_FILMS_COUNT);
      const topRatedListElement = this._filmListTopRated.getElement().querySelector(`.films-list__container`);
      renderFilms(topRatedListElement, topRatedListFilms.slice(0, RENDER_EXTRA_FILMS_COUNT), this._onDataChange, this._onViewChange, this._api);

      const mostCommentedListFilms = this._films.slice().sort((a, b) => b.comments.length - a.comments.length).slice(0, RENDER_EXTRA_FILMS_COUNT);
      const mostCommentedListElement = this._filmListMostCommented.getElement().querySelector(`.films-list__container`);
      renderFilms(mostCommentedListElement, mostCommentedListFilms.slice(0, RENDER_EXTRA_FILMS_COUNT), this._onDataChange, this._onViewChange, this._api);

      this._renderShowMore();
    }
  }

  show() {
    this._container.getElement().classList.remove(`visually-hidden`);
  }

  hide() {
    this._container.getElement().classList.add(`visually-hidden`);
  }

  _renderShowMore() {
    remove(this._showMoreComponent);

    if (this._moviesModel.getFilms().length > START_RENDER_FILMS_COUNT) {
      this._showMoreComponent = new ShowMoreComponent();
      render(this._allMoviesListElement, this._showMoreComponent, RenderPosition.AFTEREND);

      this._showMoreComponent.setShowMoreClickHandler(() => {
        const prevShowingFilmsCount = this._showingMoviesCount;
        this._showingMoviesCount = prevShowingFilmsCount + LOAD_MORE_RENDER_FILMS_COUNT;
        this._renderMainFilms(this._moviesModel.getFilms().slice(prevShowingFilmsCount, this._showingMoviesCount));

        if (this._showingMoviesCount >= this._moviesModel.getFilms().length) {
          remove(this._showMoreComponent);
        }
      });
    }
  }

  _removeFilms() {
    this._showedMovieControllers.forEach((movieController) => movieController.destroy());
    this._showedMovieControllers = [];
  }

  _renderMainFilms(films) {
    const newFilms = renderFilms(this._allMoviesListElement, films, this._onDataChange, this._onViewChange, this._api);
    this._showedMovieControllers = this._showedMovieControllers.concat(newFilms);
    this._showingMoviesCount = this._showedMovieControllers.length;
  }

  _onDataChange(movieController, oldData, newData) {
    if (newData === null) {
      this._moviesModel.deleteComment(movieController.idComment, oldData);
    } else if (oldData === null) {
      this._moviesModel.addComment(movieController.film.id, newData);
    } else {
      this._api.updateFilm(oldData.id, newData)
        .then((movieModel) => {
          const isSucsses = this._moviesModel.updateFilms(oldData.id, movieModel);
          if (isSucsses) {
            this._api.getComments(movieModel.id)
            .then((comments) => {
              movieModel.comments = comments;
              movieController.render(movieModel);
            });
          }
        });
    }
  }

  _onViewChange() {
    this._showedMovieControllers.forEach((it) => it.setDefaultView());
  }

  _onFilterSortChange() {
    this._removeFilms();
    this._renderMainFilms(this._moviesModel.getFilms().slice(0, START_RENDER_FILMS_COUNT));
    this._renderShowMore();
  }
}
