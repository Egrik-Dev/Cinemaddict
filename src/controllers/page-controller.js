import FilmComponent from '../components/film-card.js';
import PopUpComponent from '../components/popup.js';
import FilmListComponent from '../components/film-list.js';
import ShowMoreComponent from '../components/show-more.js';
import FilmListExtra from '../components/film-list-extra.js';
import {isEscEvent} from '../utils.js';
import {render, remove, RenderPosition} from '../utils/render.js';

const START_RENDER_FILMS_COUNT = 5;
const LOAD_MORE_RENDER_FILMS_COUNT = 5;
const RENDER_EXTRA_FILMS_COUNT = 2;

const renderFilm = (film, container) => {
  const filmComponent = new FilmComponent(film);
  const popupComponent = new PopUpComponent(film);

  const onPopupEscPress = (evt) => isEscEvent(evt) ? remove(popupComponent) : ``;
  const footerElement = document.querySelector(`.footer`);

  filmComponent.setPosterClickHandler(() => {
    document.addEventListener(`keydown`, onPopupEscPress);
    render(footerElement, popupComponent, RenderPosition.AFTEREND);
  });
  filmComponent.setTitleClickHandler(() => {
    document.addEventListener(`keydown`, onPopupEscPress);
    render(footerElement, popupComponent, RenderPosition.AFTEREND);
  });
  filmComponent.setCommentsClickHandler(() => {
    document.addEventListener(`keydown`, onPopupEscPress);
    render(footerElement, popupComponent, RenderPosition.AFTEREND);
  });

  popupComponent.setBtnCloseClickHandler(() => remove(popupComponent));

  return render(container, filmComponent, RenderPosition.BEFOREEND);
};

export default class PageController {
  constructor(container) {
    this._container = container;

    this._filmListComponent = new FilmListComponent();
    this._showMoreComponent = new ShowMoreComponent();
    this._filmListTopRated = new FilmListExtra(`Top rated`);
    this._filmListMostCommented = new FilmListExtra(`Most commented`);
  }

  render(films) {
    render(this._container.getElement(), this._filmListComponent, RenderPosition.BEFOREEND);
    render(this._container.getElement(), this._filmListTopRated, RenderPosition.BEFOREEND);
    render(this._container.getElement(), this._filmListMostCommented, RenderPosition.BEFOREEND);

    const allMoviesListElement = this._filmListComponent.getElement().querySelector(`.films-list__container`);

    let showingFilmsCount = START_RENDER_FILMS_COUNT;
    films.slice(0, showingFilmsCount).forEach((film) => renderFilm(film, allMoviesListElement));

    const topRatedListFilms = films.sort((a, b) => b.rating - a.rating).slice(0, RENDER_EXTRA_FILMS_COUNT);
    const topRatedListElement = this._filmListTopRated.getElement().querySelector(`.films-list__container`);
    topRatedListFilms.slice(0, RENDER_EXTRA_FILMS_COUNT).forEach((film) => renderFilm(film, topRatedListElement));

    const mostCommentedListFilms = films.sort((a, b) => b.comments.length - a.comments.length).slice(0, RENDER_EXTRA_FILMS_COUNT);
    const mostCommentedListElement = this._filmListMostCommented.getElement().querySelector(`.films-list__container`);
    mostCommentedListFilms.slice(0, RENDER_EXTRA_FILMS_COUNT).forEach((film) => renderFilm(film, mostCommentedListElement));

    render(allMoviesListElement, this._showMoreComponent, RenderPosition.AFTEREND);

    this._showMoreComponent.setShowMoreClickHandler(() => {
      const prevShowingFilmsCount = showingFilmsCount;
      showingFilmsCount = prevShowingFilmsCount + LOAD_MORE_RENDER_FILMS_COUNT;
      films.slice(prevShowingFilmsCount, showingFilmsCount).forEach((film) => renderFilm(film, allMoviesListElement));

      if (showingFilmsCount >= films.length) {
        remove(this._showMoreComponent);
      }
    });
  }
}
