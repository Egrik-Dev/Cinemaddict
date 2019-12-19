import AvatarComponent from './components/avatar.js'
import MenuComponent from './components/menu.js'
import SortComponent from './components/sort.js'
import FilmsComponent from './components/films.js'
import PageControllerComponent from './controllers/page-controller.js'
import {generateFilms} from './mock/film-card.js'
import {render, remove, RenderPosition} from './utils/render.js'

const ALL_FILMS_COUNT = 10;

const films = generateFilms(ALL_FILMS_COUNT);

const headerElement = document.querySelector(`.header`);
const mainMenuElement = document.querySelector(`.main`);

render(mainMenuElement, new MenuComponent(films), RenderPosition.BEFOREEND);
render(mainMenuElement, new SortComponent(), RenderPosition.BEFOREEND);
render(headerElement, new AvatarComponent(films), RenderPosition.BEFOREEND);

const filmsComponent = new FilmsComponent()
render(mainMenuElement, filmsComponent, RenderPosition.BEFOREEND);

const footerAllFilmsElement = document.querySelector(`.footer__statistics`).querySelector(`p`);
footerAllFilmsElement.replaceWith(`${films.length} movies inside`);

const pageControllerComponent = new PageControllerComponent(filmsComponent);
pageControllerComponent.render(films);
