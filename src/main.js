import {createAvatarTemplate} from './components/avatar.js'
import {createMenuTemplate} from './components/menu.js'
import {createFilmListTemplate} from './components/film-list.js'
import {createFilmCardTemplate} from './components/film-card.js'
import {createShowmoreBtnTemplate} from './components/show-more.js'
import {createFilmPopupTemplate} from './components/popup.js'
import {generateFilms} from './mock/film-card.js'

const ALL_FILMS_COUNT = 10;
const START_RENDER_FILMS_COUNT = 5;
const LOAD_MORE_RENDER_FILMS_COUNT = 5;
const RENDER_EXTRA_FILMS_COUNT = 2;

const renderHtml = (container, html, place = `beforeend`) => {
  container.insertAdjacentHTML(place, html);
};

const films = generateFilms(ALL_FILMS_COUNT);

const headerElement = document.querySelector(`.header`);

const mainMenuElement = document.querySelector(`.main`);
renderHtml(mainMenuElement, createMenuTemplate(films));
renderHtml(mainMenuElement, createFilmListTemplate());

const allMoviesListElement = document.querySelector(`.films-list`).querySelector(`.films-list__container`);
let showingFilmsCount = START_RENDER_FILMS_COUNT;
films.slice(0, showingFilmsCount).forEach((film) => renderHtml(allMoviesListElement, createFilmCardTemplate(film)));

renderHtml(headerElement, createAvatarTemplate(films));

const topRatedListFilms = films.sort((a, b) => b.rating - a.rating).slice(0, RENDER_EXTRA_FILMS_COUNT);
const mostCommentedListFilms = films.sort((a, b) => b.comments - a.comments).slice(0, RENDER_EXTRA_FILMS_COUNT);
const topRatedListElement = document.querySelectorAll(`.films-list--extra`)[0].querySelector(`.films-list__container`);
topRatedListFilms.slice(0, RENDER_EXTRA_FILMS_COUNT).forEach((film) => renderHtml(topRatedListElement, createFilmCardTemplate(film)));
const mostCommentedListElement = document.querySelectorAll(`.films-list--extra`)[1].querySelector(`.films-list__container`);
mostCommentedListFilms.slice(0, RENDER_EXTRA_FILMS_COUNT).forEach((film) => renderHtml(mostCommentedListElement, createFilmCardTemplate(film)));

renderHtml(allMoviesListElement, createShowmoreBtnTemplate(), `afterend`);

const showMoreButtonElement = document.querySelector(`.films-list__show-more`);
showMoreButtonElement.addEventListener(`click`, () => {
  const prevShowingFilmsCount = showingFilmsCount;
  showingFilmsCount = prevShowingFilmsCount + LOAD_MORE_RENDER_FILMS_COUNT;
  films.slice(prevShowingFilmsCount, showingFilmsCount).forEach((film) => renderHtml(allMoviesListElement, createFilmCardTemplate(film)));

  if (showingFilmsCount >= films.length) {
    showMoreButtonElement.remove();
  }
})

const footerAllFilmsElement = document.querySelector(`.footer__statistics`).querySelector(`p`);
footerAllFilmsElement.replaceWith(`${films.length} movies inside`);

const footerElement = document.querySelector(`.footer`);

renderHtml(footerElement, createFilmPopupTemplate(films[0]), `afterend`);
