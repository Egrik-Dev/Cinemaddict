import AvatarComponent from './components/avatar.js';
import SortComponent from './components/sort.js';
import FilmsComponent from './components/films.js';
import PageControllerComponent from './controllers/page-controller.js';
import FilterController from './controllers/filter-controller.js';
import MoviesModel from './models/movies';
import {generateFilms} from './mock/film-card.js';
import {render, RenderPosition} from './utils/render.js';

const ALL_FILMS_COUNT = 10;

const films = generateFilms(ALL_FILMS_COUNT); // Генерируем моки фильмов
const moviesModel = new MoviesModel(); // Создаём модель с фильмами
moviesModel.setFilms(films); // Записываём в неё массив фильмов созданных ранее

const headerElement = document.querySelector(`.header`);
const mainMenuElement = document.querySelector(`.main`);

// Создаём контроллер фильтров и передаём в него контейнер и ранее созданную модель фильмов
const filterController = new FilterController(mainMenuElement, moviesModel);
filterController.render(); // И затем запускаем метод рендеринга

render(mainMenuElement, new SortComponent(), RenderPosition.BEFOREEND);
render(headerElement, new AvatarComponent(films), RenderPosition.BEFOREEND);

const filmsComponent = new FilmsComponent();
render(mainMenuElement, filmsComponent, RenderPosition.BEFOREEND);

const footerAllFilmsElement = document.querySelector(`.footer__statistics`).querySelector(`p`);
footerAllFilmsElement.replaceWith(`${films.length} movies inside`);

const pageControllerComponent = new PageControllerComponent(filmsComponent, moviesModel);
pageControllerComponent.render();
