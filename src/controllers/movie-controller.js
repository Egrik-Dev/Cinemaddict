import FilmComponent from '../components/film-card.js';
import PopUpComponent from '../components/popup.js';
import MovieModel from '../models/movie';
import CommentModel from '../models/comment';
import {render, remove, RenderPosition, replace} from '../utils/render.js';
import {parseToJson} from '../utils/time';

const Mode = {
  DEFAULT: `default`,
  POPUP: `popup`,
};

const ESC_KEYCODE = 27;

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
    'comments': film.comments.map((comment) => comment.id)
  });
};

export default class MovieController {
  constructor(filmContainer, popupContainer, onDataChange, onViewChange, api) {
    this._filmContainer = filmContainer;
    this._popupContainer = popupContainer;
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;
    this._api = api;

    this._mode = Mode.DEFAULT;

    this._filmComponent = null;
    this.popupComponent = null;

    this.idComment = null;
    this.film = null;

    this.pauseSendComment = false;

    this._setEscKeyDownHandler = this._setEscKeyDownHandler.bind(this);
    this._setCtrlEnterKeyDownHandler = this._setCtrlEnterKeyDownHandler.bind(this);
  }

  render(film) {
    this.film = film;
    const oldFilmComponent = this._filmComponent;
    this._filmComponent = new FilmComponent(film);

    this._filmComponent.setPosterClickHandler(() => {
      this._createPopupComponent();
    });

    this._filmComponent.setTitleClickHandler(() => {
      this._createPopupComponent();
    });

    this._filmComponent.setCommentsClickHandler(() => {
      this._createPopupComponent();
    });

    this._filmComponent.setWatchlistClickHandler(() => {
      const newMovie = MovieModel.clone(film);
      newMovie.watchlist = !newMovie.watchlist;
      this._onDataChange(this, film, newMovie);
    });

    this._filmComponent.setAswatchedClickHandler(() => {
      const newMovie = MovieModel.clone(film);
      newMovie.alreadyWatched = !newMovie.alreadyWatched;
      newMovie.watchingDate = parseToJson(Date.now());
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
      render(this._filmContainer, this._filmComponent, RenderPosition.BEFOREEND);
    }
  }

  setDefaultView() {
    if (this._mode !== Mode.DEFAULT) {
      remove(this.popupComponent);
      this.popupComponent = null;
      this._mode = Mode.DEFAULT;
      document.removeEventListener(`keydown`, this._setEscKeyDownHandler);
      document.removeEventListener(`keydown`, this._setCtrlEnterKeyDownHandler);
    }
  }

  destroy() {
    remove(this._filmComponent);
    document.removeEventListener(`keydown`, this._setEscKeyDownHandler);
    document.removeEventListener(`keydown`, this._setCtrlEnterKeyDownHandler);
  }

  _createPopupComponent() {
    document.addEventListener(`keydown`, this._setEscKeyDownHandler);
    document.addEventListener(`keydown`, this._setCtrlEnterKeyDownHandler);
    this._renderPopupComponent();
    this._toggleMovieToPopup();
  }

  _resetPersonalRating() {
    this.film.personalRating = 0;
  }

  _addNewComment() {
    this.pauseSendComment = true;
    this.popupComponent.disableCommentForm();

    const newCommentModel = new CommentModel({
      emotion: this.popupComponent.emoji,
      comment: this.popupComponent.currentComment,
      date: parseToJson(Date.now())
    });
    this._onDataChange(this, null, newCommentModel);
  }

  _updateFilmCard() {
    const formData = this.popupComponent.getData();
    const data = parseFormData(formData, this.film);

    this.setDefaultView();
    this._onDataChange(this, this.film, data);
  }

  _toggleMovieToPopup() {
    this._onViewChange();

    this._mode = Mode.POPUP;
  }

  _setEscKeyDownHandler(evt) {
    if (evt.keyCode === ESC_KEYCODE && this.popupComponent) {
      this._updateFilmCard();
    }
  }

  _setCtrlEnterKeyDownHandler(evt) {
    const ctrlEnter = (evt.ctrlKey || evt.metaKey) && (evt.key === `Enter` || evt.key === `Ent`);
    if (ctrlEnter && this.popupComponent.currentComment && this.popupComponent.emoji && !this.pauseSendComment) {
      this._addNewComment();
    }
  }

  _renderPopupComponent() {
    this._api.getComments(this.film.id)
    .then((comments) => {
      this.film.comments = comments;
      this.popupComponent = new PopUpComponent(this.film);
      this._setPopupHandlers();
      render(this._popupContainer, this.popupComponent, RenderPosition.AFTEREND);
    });
  }

  _setPopupHandlers() {
    this.popupComponent.setDeleteCommentClickHandler((comment) => {
      this.idComment = comment;
      this._onDataChange(this, this.film, null);
    });

    this.popupComponent.setBtnCloseClickHandler(() => {
      this._updateFilmCard();
    });

    this.popupComponent.setIsWatchedClickHandler(() => {
      this.popupComponent.isWatched = !this.popupComponent.isWatched;
      if (!this.popupComponent.isWatched) {
        this._resetPersonalRating();
      }
      this.film.watchingDate = parseToJson(Date.now());
      this.popupComponent.rerender();
    });

    this.popupComponent.setUndoClickHandler(() => {
      this.popupComponent.isWatched = !this.popupComponent.isWatched;
      this._resetPersonalRating();
      this.popupComponent.rerender();
    });

    this.popupComponent.setInputRatingClickHandler((currentRating) => {
      this.film.personalRating = Number(currentRating);

      const newMovie = MovieModel.clone(this.film);
      newMovie.personalRating = Number(currentRating);
      newMovie.comments = newMovie.comments.map((comment) => comment.id);
      this._onDataChange(this, this.film, newMovie);
    });
  }

  errorSendComment() {
    this.pauseSendComment = false;
    this.popupComponent.errorCommentForm();
  }
}
