import FilmComponent from '../components/film-card.js';
import PopUpComponent from '../components/popup.js';
import {isEscEvent} from '../utils.js';
import {render, remove, RenderPosition, replace} from '../utils/render.js';

export default class MovieController {
  constructor(container, onDataChange) {
    this._container = container;

    this._popupComponent = null;
    this._filmComponent = null;
    this._onDataChange = onDataChange;
  }

  render(film) {
    const oldPopupComponent = this._popupComponent;
    const oldFilmComponent = this._filmComponent;

    this._popupComponent = new PopUpComponent(film);
    this._filmComponent = new FilmComponent(film);
    const onPopupEscPress = (evt) => isEscEvent(evt) ? remove(this._popupComponent) : ``;

    this._filmComponent.setPosterClickHandler(() => {
      document.addEventListener(`keydown`, onPopupEscPress);
      render(this._container, this._popupComponent, RenderPosition.AFTEREND);
    });
    this._filmComponent.setTitleClickHandler(() => {
      document.addEventListener(`keydown`, onPopupEscPress);
      render(this._container, this._popupComponent, RenderPosition.AFTEREND);
    });
    this._filmComponent.setCommentsClickHandler(() => {
      document.addEventListener(`keydown`, onPopupEscPress);
      render(this._container, this._popupComponent, RenderPosition.AFTEREND);
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

    this._popupComponent.setWatchlistClickHandler(() => {
      this._onDataChange(this, film, Object.assign({}, film, {
        watchlist: !film.watchlist,
      }));
    });

    this._popupComponent.setAswatchedClickHandler(() => {
      this._onDataChange(this, film, Object.assign({}, film, {
        watched: !film.watched,
      }));
    });

    this._popupComponent.setFavoriteClickHandler(() => {
      this._onDataChange(this, film, Object.assign({}, film, {
        favorite: !film.favorite,
      }));
    });

    this._popupComponent.setBtnCloseClickHandler(() => remove(this._popupComponent));

    if (oldPopupComponent && oldFilmComponent) {
      replace(this._popupComponent, oldPopupComponent);
      replace(this._filmComponent, oldFilmComponent);
    } else {
      return render(this._container, this._filmComponent, RenderPosition.BEFOREEND);
    }
  }
}
