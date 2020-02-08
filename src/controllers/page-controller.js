import FilmListComponent from '../components/film-list.js';
import ShowMoreComponent from '../components/show-more.js';
import FilmListExtra from '../components/film-list-extra.js';
import NoFilmsComponent from '../components/no-films';
import MovieControllerComponent from './movie-controller.js';
import {render, remove, RenderPosition} from '../utils/render.js';

const START_RENDER_FILMS_COUNT = 5;
const LOAD_MORE_RENDER_FILMS_COUNT = 5;
const RENDER_EXTRA_FILMS_COUNT = 2;

const renderFilms = (FilmComponentContainer, PopupComponentConatainer, films, onDataChange, onViewChange, api) => {
  return films.map((film) => {
    const movieControllerComponent = new MovieControllerComponent(FilmComponentContainer, PopupComponentConatainer, onDataChange, onViewChange, api);
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
    this._noFilmsComponent = null;

    this._setDataChangeHandler = this._setDataChangeHandler.bind(this);
    this._setViewChangeHandler = this._setViewChangeHandler.bind(this);
    this._setFilterSortChangeHandler = this._setFilterSortChangeHandler.bind(this);

    this._allMoviesListElement = null;
    this._isLoading = false;

    this._moviesModel.setFilterClickHandler(this._setFilterSortChangeHandler);
    this._moviesModel.setSortClickHandler(this._setFilterSortChangeHandler);

    this._showedMovieControllers = [];
    this._showedExtraMovieControllers = [];
    this._showingMoviesCount = START_RENDER_FILMS_COUNT;

    this._extraListFilms = [];
  }

  render() {
    this._films = this._moviesModel.getFilmsAll();

    render(this._container.getElement(), this._filmListComponent, RenderPosition.BEFOREEND);
    this._allMoviesListElement = this._filmListComponent.getElement().querySelector(`.films-list__container`);

    if (this._noFilmsComponent) {
      remove(this._noFilmsComponent);
    }

    if (this._films.length === 0) {
      this._noFilmsComponent = new NoFilmsComponent(this._isLoading);
      render(this._allMoviesListElement, this._noFilmsComponent, RenderPosition.AFTEREND);
    } else {
      render(this._container.getElement(), this._filmListTopRated, RenderPosition.BEFOREEND);
      render(this._container.getElement(), this._filmListMostCommented, RenderPosition.BEFOREEND);

      this._renderMainFilms(this._films.slice(0, this._showingMoviesCount));

      this._renderExtraFilms();
      this._renderShowMore();
    }
  }

  show() {
    this._container.getElement().classList.remove(`visually-hidden`);
  }

  hide() {
    this._container.getElement().classList.add(`visually-hidden`);
  }

  enableLoadingStatus(boolean) {
    this._isLoading = boolean;
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
    const newFilms = renderFilms(this._allMoviesListElement, this._container.getElement(), films, this._setDataChangeHandler, this._setViewChangeHandler, this._api);
    this._showedMovieControllers = this._showedMovieControllers.concat(newFilms);
    this._showingMoviesCount = this._showedMovieControllers.length;
  }

  _renderExtraFilms() {
    const newTopRatedListFilms = this._moviesModel.getFilmsAll().slice().sort((a, b) => b.totalRating - a.totalRating).slice(0, RENDER_EXTRA_FILMS_COUNT);
    const newMostCommentedListFilms = this._moviesModel.getFilmsAll().slice().sort((a, b) => b.comments.length - a.comments.length).slice(0, RENDER_EXTRA_FILMS_COUNT);

    const newExtraListFilms = newTopRatedListFilms.concat(newMostCommentedListFilms);
    const topRatedListElement = this._filmListTopRated.getElement().querySelector(`.films-list__container`);
    const mostCommentedListElement = this._filmListMostCommented.getElement().querySelector(`.films-list__container`);

    if (JSON.stringify(this._extraListFilms) !== JSON.stringify(newExtraListFilms)) {
      this._extraListFilms = newExtraListFilms;
      this._showedExtraMovieControllers.map((film) => film.destroy());

      const newTopRatedMovieControllers = renderFilms(topRatedListElement, this._container.getElement(), newTopRatedListFilms, this._setDataChangeHandler, this._setViewChangeHandler, this._api);
      const newMostCommentedMovieControllers = renderFilms(mostCommentedListElement, this._container.getElement(), newMostCommentedListFilms, this._setDataChangeHandler, this._setViewChangeHandler, this._api);

      this._showedExtraMovieControllers = newTopRatedMovieControllers.concat(newMostCommentedMovieControllers);
    }
  }

  _setDataChangeHandler(movieController, oldData, newData) {
    if (newData === null) {
      this._api.deleteComment(movieController.idComment)
        .then(() => {
          this._moviesModel.deleteComment(movieController.idComment, oldData);
          movieController.popupComponent.rerender();
        })
        .catch(() => movieController.popupComponent.errorDeleteComment());
    } else if (oldData === null) {
      this._api.createComment(movieController.film.id, newData)
        .then((comment) => {
          this._moviesModel.addComment(movieController.film.id, comment);
          movieController.popupComponent.currentComment = null;
          movieController.popupComponent.emoji = null;
          movieController.pauseSendComment = false;
          movieController.popupComponent.rerender();
        })
        .catch(() => movieController.errorSendComment());
    } else {
      this._api.updateFilm(oldData.id, newData)
        .then((movieModel) => {
          if (movieController.popupComponent) {
            movieController.popupComponent.enableInputsRating();
            movieController.film.personalRating = newData.personalRating;
          } else {
            this._moviesModel.updateFilms(oldData.id, movieModel);
            movieController.render(movieModel);
            this._renderExtraFilms();
          }
        })
        .catch(() => movieController.popupComponent.errorRatingForm());
    }
  }

  _setViewChangeHandler() {
    this._showedMovieControllers.forEach((it) => it.setDefaultView());
    this._showedExtraMovieControllers.forEach((it) => it.setDefaultView());
  }

  _setFilterSortChangeHandler() {
    this._removeFilms();
    this._renderMainFilms(this._moviesModel.getFilms().slice(0, START_RENDER_FILMS_COUNT));
    this._renderShowMore();
  }
}
