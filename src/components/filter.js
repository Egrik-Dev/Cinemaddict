import AbstractSmartComponent from './abstract-smart-component.js';

export const FilterTytle = {
  all: `All movies`,
  watchlist: `Watchlist`,
  history: `History`,
  favorites: `Favorites`,
};

const createFilterMarkup = (filter, isChecked) => {
  return (`<a href="#${filter.name}"
    class="main-navigation__item
    ${isChecked ? `main-navigation__item--active` : ``}">
    ${FilterTytle[filter.name]}
    ${(filter.name !== `all`) ? `<span class="main-navigation__item-count">${filter.count}</span>` : ``}
  </a>`);
};

const createFiltersTemplate = (filters) => {
  const filtersMarkup = filters.map((filter) => createFilterMarkup(filter, filter.checked)).join(`\n`);

  return (`<nav class="main-navigation">
    ${filtersMarkup}
    <a href="#stats" class="main-navigation__item main-navigation__item--additional">Stats</a>
  </nav>`);
};

export default class Filter extends AbstractSmartComponent {
  constructor(filters) {
    super();

    this._filters = filters;
  }

  getTemplate() {
    return createFiltersTemplate(this._filters);
  }

  setFilterClickHandler(handler) {
    const filtersTitle = this.getElement().querySelectorAll(`.main-navigation__item`);
    filtersTitle.forEach((filter) => {
      filter.addEventListener(`click`, () => {
        const filterName = filter.getAttribute(`href`);
        handler(filterName.substring(1), filter);
      });
    });
  }
}
