import FilmComponent from '../components/film-card.js';
import PopUpComponent from '../components/popup.js';
import {render, remove, RenderPosition, replace} from '../utils/render.js';
import {generateDateNow} from '../utils/const';

const Mode = {
  DEFAULT: `default`,
  POPUP: `popup`,
};

export default class MovieController {
  constructor(container, onDataChange, onViewChange) {
    this._container = container;
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;

    this._mode = Mode.DEFAULT;

    this._filmComponent = null;
    this._idComment = null;
    this._film = null;

    this._onEscKeyDown = this._onEscKeyDown.bind(this);
    this._onCtrlEnterKeyDown = this._onCtrlEnterKeyDown.bind(this);
  }

  render(film) {
    this._film = film;
    const oldFilmComponent = this._filmComponent;

    if (this._mode === Mode.DEFAULT) {
      this._popupComponent = new PopUpComponent(film);

      this._popupComponent.setDeleteCommentClickHandler((evt) => {
        evt.preventDefault();
        this._idComment = evt.target.parentNode.parentNode.parentNode.id;
        this._onDataChange(this, film, null);
        this._popupComponent.rerender();
      });

      this._popupComponent.setBtnCloseClickHandler(() => {
        this._updateFilmCard();
      });
    }

    this._filmComponent = new FilmComponent(film);

    this._filmComponent.setPosterClickHandler(() => {
      document.addEventListener(`keydown`, this._onEscKeyDown);
      document.addEventListener(`keydown`, this._onCtrlEnterKeyDown);
      render(this._container, this._popupComponent, RenderPosition.AFTEREND);
      this._toggleMovieToPopup();
    });

    this._filmComponent.setTitleClickHandler(() => {
      document.addEventListener(`keydown`, this._onEscKeyDown);
      document.addEventListener(`keydown`, this._onCtrlEnterKeyDown);
      render(this._container, this._popupComponent, RenderPosition.AFTEREND);
      this._toggleMovieToPopup();
    });

    this._filmComponent.setCommentsClickHandler(() => {
      document.addEventListener(`keydown`, this._onEscKeyDown);
      document.addEventListener(`keydown`, this._onCtrlEnterKeyDown);
      render(this._container, this._popupComponent, RenderPosition.AFTEREND);
      this._toggleMovieToPopup();
    });

    this._filmComponent.setWatchlistClickHandler(() => {
      this._onDataChange(this, film, Object.assign({}, film, {
        watchlist: !film.watchlist,
      }));
    });

    this._filmComponent.setAswatchedClickHandler(() => {
      this._onDataChange(this, film, Object.assign({}, film, {
        watched: !film.watched,
      }));
    });

    this._filmComponent.setFavoriteClickHandler(() => {
      this._onDataChange(this, film, Object.assign({}, film, {
        favorite: !film.favorite,
      }));
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
    remove(this._popupComponent);
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
    const data = this._popupComponent.getData();
    this._onDataChange(this, this._film, Object.assign({}, this._film, data));
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
}
