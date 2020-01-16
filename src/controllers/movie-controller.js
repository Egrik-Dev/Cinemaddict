import FilmComponent from '../components/film-card.js';
import PopUpComponent from '../components/popup.js';
import MovieModel from '../models/movie';
import {render, remove, RenderPosition, replace} from '../utils/render.js';
import {generateDateNow} from '../utils/const';

const Mode = {
  DEFAULT: `default`,
  POPUP: `popup`,
};

const parseFormData = (formData, film) => {
  return new MovieModel({
    'id': film.id,
    'film_info': {
      'title': film.title,
      'alternative_title': film.alternativeTitle,
      'total_rating': film.totalRating,
      'poster': film.poster,
      'age_rating': film.ageRating,
      'director': film.director,
      'writers': film.writers,
      'actors': film.actors,
      'release': film.release,
      'runtime': film.runtime,
      'genre': film.genre,
      'description': film.description,
    },
    'user_details': {
      'personal_rating': film.personalRating,
      'watchlist': Boolean(formData.get(`watchlist`)),
      'already_watched': Boolean(formData.get(`watched`)),
      'watching_date': film.watchingDate,
      'favorite': Boolean(formData.get(`favorite`)),
    },
    'comments': []
  });
};

export default class MovieController {
  constructor(container, onDataChange, onViewChange, api) {
    this._container = container;
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;
    this._api = api;

    this._mode = Mode.DEFAULT;

    this._filmComponent = null;
    this.idComment = null;
    this.film = null;

    this._onEscKeyDown = this._onEscKeyDown.bind(this);
    this._onCtrlEnterKeyDown = this._onCtrlEnterKeyDown.bind(this);
  }

  render(film) {
    this.film = film;
    const oldFilmComponent = this._filmComponent;
    this._filmComponent = new FilmComponent(film);

    this._filmComponent.setPosterClickHandler(() => {
      document.addEventListener(`keydown`, this._onEscKeyDown);
      document.addEventListener(`keydown`, this._onCtrlEnterKeyDown);
      this._createPopupComponent();
      this._toggleMovieToPopup();
    });

    this._filmComponent.setTitleClickHandler(() => {
      document.addEventListener(`keydown`, this._onEscKeyDown);
      document.addEventListener(`keydown`, this._onCtrlEnterKeyDown);
      this._createPopupComponent();
      this._toggleMovieToPopup();
    });

    this._filmComponent.setCommentsClickHandler(() => {
      document.addEventListener(`keydown`, this._onEscKeyDown);
      document.addEventListener(`keydown`, this._onCtrlEnterKeyDown);
      this._createPopupComponent();
      this._toggleMovieToPopup();
    });

    this._filmComponent.setWatchlistClickHandler(() => {
      const newMovie = MovieModel.clone(film);
      newMovie.watchlist = !newMovie.watchlist;
      this._onDataChange(this, film, newMovie);
    });

    this._filmComponent.setAswatchedClickHandler(() => {
      const newMovie = MovieModel.clone(film);
      newMovie.alreadyWatched = !newMovie.alreadyWatched;
      this._onDataChange(this, film, newMovie);
    });

    this._filmComponent.setFavoriteClickHandler(() => {
      const newMovie = MovieModel.clone(film);
      newMovie.favorite = !newMovie.favorite;
      this._onDataChange(this, film, newMovie);
    });

    if (oldFilmComponent) {
      replace(this._filmComponent, oldFilmComponent);
    } else {
      render(this._container, this._filmComponent, RenderPosition.BEFOREEND);
    }
  }

  setDefaultView() {
    if (this._mode !== Mode.DEFAULT) {
      remove(this._popupComponent);
      this._mode = Mode.DEFAULT;
      document.removeEventListener(`keydown`, this._onEscKeyDown);
      document.removeEventListener(`keydown`, this._onCtrlEnterKeyDown);
    }
  }

  destroy() {
    remove(this._filmComponent);
    // remove(this._popupComponent);
    document.removeEventListener(`keydown`, this._onEscKeyDown);
    document.removeEventListener(`keydown`, this._onCtrlEnterKeyDown);
  }

  _addNewComment() {
    this._onDataChange(this, null, Object.assign({
      id: 999,
      author: `Some User`,
      emotion: this._popupComponent._emoji,
      comment: this._popupComponent._currentComment,
      date: generateDateNow()
    }));
  }

  _updateFilmCard() {
    const formData = this._popupComponent.getData();
    const data = parseFormData(formData, this.film);

    this._onDataChange(this, this.film, data);
    this.setDefaultView();
  }

  _toggleMovieToPopup() {
    this._onViewChange();

    this._mode = Mode.POPUP;
  }

  _onEscKeyDown(evt) {
    const ESC_KEYCODE = 27;
    if (evt.keyCode === ESC_KEYCODE) {
      this._updateFilmCard();
    }
  }

  _onCtrlEnterKeyDown(evt) {
    const ctrlEnter = (evt.ctrlKey || evt.metaKey) && (evt.key === `Enter` || evt.key === `Ent`);

    if (ctrlEnter && this._popupComponent._currentComment && this._popupComponent._emoji) {
      this._addNewComment();
      this._popupComponent._currentComment = null;
      this._popupComponent.rerender();
    }
  }

  _createPopupComponent() {
    this._api.getComments(this.film.id)
    .then((comments) => {
      this.film.comments = comments;
      this._popupComponent = new PopUpComponent(this.film);
      this._setPopupHandlers();
      render(this._container, this._popupComponent, RenderPosition.AFTEREND);
    });
  }

  _setPopupHandlers() {
    this._popupComponent.setDeleteCommentClickHandler((evt) => {
      evt.preventDefault();
      this.idComment = evt.target.parentNode.parentNode.parentNode.id;
      this._onDataChange(this, this.film, null);
      this._popupComponent.rerender();
    });

    this._popupComponent.setBtnCloseClickHandler(() => {
      this._updateFilmCard();
    });
  }
}
