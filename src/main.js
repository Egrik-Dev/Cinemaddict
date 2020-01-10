import API from './api.js';
import AvatarComponent from './components/avatar.js';
import SortComponent from './components/sort.js';
import FilmsComponent from './components/films.js';
import PageControllerComponent from './controllers/page-controller.js';
import FilterController from './controllers/filter-controller.js';
import MoviesModel from './models/movies';
import {render, RenderPosition} from './utils/render.js';

const AUTHORIZATION = `Basic eo0w590ik29889a`;
const END_POINT = `https://htmlacademy-es-10.appspot.com/cinemaddict`;

const api = new API(END_POINT, AUTHORIZATION);
const moviesModel = new MoviesModel();

const headerElement = document.querySelector(`.header`);
const mainMenuElement = document.querySelector(`.main`);
const footerAllFilmsElement = document.querySelector(`.footer__statistics`).querySelector(`p`);

const filmsComponent = new FilmsComponent();
const pageControllerComponent = new PageControllerComponent(filmsComponent, moviesModel, api);
const filterController = new FilterController(mainMenuElement, moviesModel);

filterController.render();
render(mainMenuElement, new SortComponent(), RenderPosition.BEFOREEND);
render(mainMenuElement, filmsComponent, RenderPosition.BEFOREEND);

api.getFilms()
   .then((films) => {
     moviesModel.setFilms(films);
     render(headerElement, new AvatarComponent(films), RenderPosition.BEFOREEND);
     pageControllerComponent.render();
     footerAllFilmsElement.replaceWith(`${films.length} movies inside`);
   });
