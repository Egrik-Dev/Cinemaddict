import AbstractComponent from './abstract-component';

const createNoFilmsTemplate = (isLoading) => {
  return (`<h2 class="films-list__title">${(isLoading) ? `Loading...` : `There are no movies in our database`}</h2>`);
};

export default class NoFilms extends AbstractComponent {
  constructor(isLoading) {
    super();

    this._isLoading = isLoading;
  }

  getTemplate() {
    return createNoFilmsTemplate(this._isLoading);
  }
}
