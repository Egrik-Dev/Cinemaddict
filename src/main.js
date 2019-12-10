import AvatarComponent from './components/avatar.js'
import MenuComponent from './components/menu.js'
import SortComponent from './components/sort.js'
import FilmListComponent from './components/film-list.js'
import FilmComponent from './components/film-card.js'
import ShowMoreComponent from './components/show-more.js'
import PopUpComponent from './components/popup.js'
import {generateFilms} from './mock/film-card.js'
import {render, RenderPosition, isEscEvent} from './utils.js'

const ALL_FILMS_COUNT = 10;
const START_RENDER_FILMS_COUNT = 5;
const LOAD_MORE_RENDER_FILMS_COUNT = 5;
const RENDER_EXTRA_FILMS_COUNT = 2;

const films = generateFilms(ALL_FILMS_COUNT);
console.log(films);

const headerElement = document.querySelector(`.header`)
const footerElement = document.querySelector(`.footer`);

const mainMenuElement = document.querySelector(`.main`);
render(mainMenuElement, new MenuComponent(films).getElement(), RenderPosition.BEFOREEND);
render(mainMenuElement, new SortComponent().getElement(), RenderPosition.BEFOREEND);
render(mainMenuElement, new FilmListComponent().getElement(), RenderPosition.BEFOREEND);

const allMoviesListElement = document.querySelector(`.films-list`).querySelector(`.films-list__container`);
let showingFilmsCount = START_RENDER_FILMS_COUNT;

const renderFilm = (film, container) => {
  const filmComponent = new FilmComponent(film);
  const popupComponent = new PopUpComponent(film);

  const poster = filmComponent.getElement().querySelector(`.film-card__poster`);
  const title = filmComponent.getElement().querySelector(`.film-card__title`);
  const comments = filmComponent.getElement().querySelector(`.film-card__comments`);
  const btnClose = popupComponent.getElement().querySelector(`.film-details__close-btn`);

  const closePopUp = () => {
    document.removeEventListener('keydown', onPopupEscPress);
    const popupElement = document.querySelector(`.film-details`);
    popupElement.remove();
  }

  var onPopupEscPress = function (evt) {
    isEscEvent(evt, closePopUp);
  };

  poster.addEventListener(`click`, () => {
    document.addEventListener('keydown', onPopupEscPress);
    render(footerElement, popupComponent.getElement(), RenderPosition.AFTEREND)});
  title.addEventListener(`click`, () => {
    document.addEventListener('keydown', onPopupEscPress);
    render(footerElement, popupComponent.getElement(), RenderPosition.AFTEREND)});
  comments.addEventListener(`click`, () => {
    document.addEventListener('keydown', onPopupEscPress);
    render(footerElement, popupComponent.getElement(), RenderPosition.AFTEREND)});

  btnClose.addEventListener(`click`, closePopUp);


  return render(container, filmComponent.getElement(), RenderPosition.BEFOREEND)
}

films.slice(0, showingFilmsCount).forEach((film) => renderFilm(film, allMoviesListElement));

render(headerElement, new AvatarComponent(films).getElement(), RenderPosition.BEFOREEND);

const topRatedListFilms = films.sort((a, b) => b.rating - a.rating).slice(0, RENDER_EXTRA_FILMS_COUNT);
const mostCommentedListFilms = films.sort((a, b) => b.comments - a.comments).slice(0, RENDER_EXTRA_FILMS_COUNT);
const topRatedListElement = document.querySelectorAll(`.films-list--extra`)[0].querySelector(`.films-list__container`);
topRatedListFilms.slice(0, RENDER_EXTRA_FILMS_COUNT).forEach((film) => renderFilm(film, topRatedListElement));

const mostCommentedListElement = document.querySelectorAll(`.films-list--extra`)[1].querySelector(`.films-list__container`);
mostCommentedListFilms.slice(0, RENDER_EXTRA_FILMS_COUNT).forEach((film) => renderFilm(film, mostCommentedListElement));

render(allMoviesListElement, new ShowMoreComponent().getElement(), RenderPosition.AFTEREND);

const showMoreButtonElement = document.querySelector(`.films-list__show-more`);
showMoreButtonElement.addEventListener(`click`, () => {
  const prevShowingFilmsCount = showingFilmsCount;
  showingFilmsCount = prevShowingFilmsCount + LOAD_MORE_RENDER_FILMS_COUNT;
  films.slice(prevShowingFilmsCount, showingFilmsCount).forEach((film) => renderFilm(film, allMoviesListElement));

  if (showingFilmsCount >= films.length) {
    showMoreButtonElement.remove();
  }
})

const footerAllFilmsElement = document.querySelector(`.footer__statistics`).querySelector(`p`);
footerAllFilmsElement.replaceWith(`${films.length} movies inside`);
