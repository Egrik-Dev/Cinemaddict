import {createAvatarTemplate} from './components/avatar.js'
import {createMenuTemplate} from './components/menu.js'
import {createFilmListTemplate} from './components/film-list.js'
import {createFilmCardTemplate} from './components/film-card.js'
import {createShowmoreBtnTemplate} from './components/show-more.js'
import {createFilmPopupTemplate} from './components/popup.js'

const MAIN_FILMS_COUNT = 5;
const OTHER_FILMS_COUNT = 2;

const renderHtml = (container, html, place = `beforeend`) => {
  container.insertAdjacentHTML(place, html);
};

const headerElement = document.querySelector(`.header`);

renderHtml(headerElement, createAvatarTemplate());

const mainMenuElement = document.querySelector(`.main`);

renderHtml(mainMenuElement, createMenuTemplate());
renderHtml(mainMenuElement, createFilmListTemplate());

const renderFilmCards = (count, container) => (
  new Array(count)
  .fill(``)
  .forEach(
      () => renderHtml(container, createFilmCardTemplate())
  )
);

const allMoviesListElement = document.querySelector(`.films-list`).querySelector(`.films-list__container`);

renderFilmCards(MAIN_FILMS_COUNT, allMoviesListElement);

const extraMoviesListElement = document.querySelectorAll(`.films-list--extra`);

extraMoviesListElement.forEach(function (item) {
  const filmsContainerElement = item.querySelector(`.films-list__container`);
  renderFilmCards(OTHER_FILMS_COUNT, filmsContainerElement);
});

renderHtml(allMoviesListElement, createShowmoreBtnTemplate(), `afterend`);

const footerElement = document.querySelector(`.footer`);

renderHtml(footerElement, createFilmPopupTemplate(), `afterend`);
