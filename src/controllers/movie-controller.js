import FilmComponent from '../components/film-card.js';
import PopUpComponent from '../components/popup.js';
import {isEscEvent} from '../utils.js';
import {render, remove, RenderPosition, replace} from '../utils/render.js';

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

    this._popupComponent = null;
    this._filmComponent = null;
  }

  render(film) {
    const oldFilmComponent = this._filmComponent;

    this._popupComponent = new PopUpComponent(film);
    this._filmComponent = new FilmComponent(film);

    const onPopupEscPress = (evt) => isEscEvent(evt) ? remove(this._popupComponent) : ``;

    this._filmComponent.setPosterClickHandler(() => {
      document.addEventListener(`keydown`, onPopupEscPress);
      render(this._container, this._popupComponent, RenderPosition.AFTEREND);
      this._toggleMovieToPopup();
    });
    this._filmComponent.setTitleClickHandler(() => {
      document.addEventListener(`keydown`, onPopupEscPress);
      render(this._container, this._popupComponent, RenderPosition.AFTEREND);
      this._toggleMovieToPopup();
    });
    this._filmComponent.setCommentsClickHandler(() => {
      document.addEventListener(`keydown`, onPopupEscPress);
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

    this._popupComponent.setBtnCloseClickHandler(() => remove(this._popupComponent));

    return (oldFilmComponent) ? replace(this._filmComponent, oldFilmComponent) : render(this._container, this._filmComponent, RenderPosition.BEFOREEND);

    // if (oldFilmComponent) {
    //   replace(this._filmComponent, oldFilmComponent);
    // } else {
    //   return render(this._container, this._filmComponent, RenderPosition.BEFOREEND);
    // }
  }

  setDefaultView() {
    if (this._mode !== Mode.DEFAULT) {
      remove(this._popupComponent);
      this._mode = Mode.DEFAULT;
    }
  }

  _toggleMovieToPopup() {
    this._onViewChange();

    this._mode = Mode.POPUP;
  }
}
