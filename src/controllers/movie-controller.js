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

const SHAKE_ANIMATION_TIMEOUT = 600;

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
    this.popupComponent = null;

    this.idComment = null;
    this.film = null;

    this._activeRating = null;
    this.ratingInputs = null;

    this._onEscKeyDown = this._onEscKeyDown.bind(this);
    this._onCtrlEnterKeyDown = this._onCtrlEnterKeyDown.bind(this);
  }

  render(film) {
    this.film = film;
    const oldFilmComponent = this._filmComponent;
    this._filmComponent = new FilmComponent(film);

    // ОБРАБОТЧИКИ ДЛЯ ВХОДА В ПОПАП

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

    // ОБРАБОТЧИКИ ПОЛЬЗОВАТЕЛЬСКИХ КНОПОК

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
      remove(this.popupComponent);
      this.popupComponent = null;
      this._mode = Mode.DEFAULT;
      document.removeEventListener(`keydown`, this._onEscKeyDown);
      document.removeEventListener(`keydown`, this._onCtrlEnterKeyDown);
    }
  }

  destroy() {
    remove(this._filmComponent);
    document.removeEventListener(`keydown`, this._onEscKeyDown);
    document.removeEventListener(`keydown`, this._onCtrlEnterKeyDown);
  }

  _addNewComment() {
    const commentArea = this.popupComponent.getElement().querySelector(`.film-details__comment-input`);
    commentArea.setAttribute(`disabled`, true);
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

  _onEscKeyDown(evt) {
    const ESC_KEYCODE = 27;
    if (evt.keyCode === ESC_KEYCODE) {
      this._updateFilmCard();
    }
  }

  _onCtrlEnterKeyDown(evt) {
    const ctrlEnter = (evt.ctrlKey || evt.metaKey) && (evt.key === `Enter` || evt.key === `Ent`);
    if (ctrlEnter && this.popupComponent.currentComment && this.popupComponent.emoji) {
      this._addNewComment();
    }
  }

  _createPopupComponent() {
    this._api.getComments(this.film.id)
    .then((comments) => {
      this.film.comments = comments;
      this.popupComponent = new PopUpComponent(this.film);
      this._setPopupHandlers();
      render(this._container, this.popupComponent, RenderPosition.AFTEREND);
    });
  }

  _setPopupHandlers() {
    this.popupComponent.setDeleteCommentClickHandler((evt) => {
      evt.preventDefault();
      this.idComment = evt.target.parentNode.parentNode.parentNode.id;
      this._onDataChange(this, this.film, null);
    });

    this.popupComponent.setBtnCloseClickHandler(() => {
      this._updateFilmCard();
    });

    this.popupComponent.setInputRatingClickHandler((evt) => {
      // Убираем красную кнопку (если она была)
      if (this._activeRating) {
        this._activeRating.style.backgroundColor = `#d8d8d8`;
      }
      // Находим все инпуты
      this.ratingInputs = this.popupComponent.getElement().querySelectorAll(`.film-details__user-rating-input`);
      // Блокируем все инпуты
      this.ratingInputs.forEach((ratingInput) => {
        ratingInput.setAttribute(`disabled`, true);
      });
      // Фиксируем балл который был выбран пользователем и фиксируем элемент (label)
      const currentRating = evt.target.value;
      this._activeRating = evt.target.nextElementSibling;
      // Копируем модель и меняем в копии значение оценки
      const newMovie = MovieModel.clone(this.film);
      newMovie.personalRating = Number(currentRating);
      // Передаём измененные данные наружу
      this._onDataChange(this, this.film, newMovie);
    });
  }

  errorRatingForm() {
    const ratingForm = this.popupComponent.getElement().querySelector(`.film-details__user-rating-score`);
    ratingForm.style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / 1000}s`;
    this.ratingInputs.forEach((ratingInput) => {
      ratingInput.removeAttribute(`disabled`);
    });
    this._activeRating.style.backgroundColor = `red`;

    setTimeout(() => {
      ratingForm.style.animation = ``;
    }, SHAKE_ANIMATION_TIMEOUT);
  }

  errorCommentForm() {
    const commentForm = this.popupComponent.getElement().querySelector(`.film-details__new-comment`);
    const commentArea = this.popupComponent.getElement().querySelector(`.film-details__comment-input`);
    commentArea.removeAttribute(`disabled`);
    commentArea.style.border = `2px solid red`;
    commentForm.style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / 1000}s`;

    setTimeout(() => {
      commentForm.style.animation = ``;
      commentArea.style.border = ``;
    }, SHAKE_ANIMATION_TIMEOUT);
  }
}
