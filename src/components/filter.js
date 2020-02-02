import AbstractSmartComponent from './abstract-smart-component.js';

export const MenuType = {
  FILTER: `filter`,
  STATS: `stats`,
};

const createFilterMarkup = (filter, isChecked) => {
  return (`<a href="#${filter.name}"
    data-menuType=${MenuType.FILTER}
    class="main-navigation__item
    ${isChecked ? `main-navigation__item--active` : ``}">
    ${filter.name}
    ${(filter.name !== `All movies`) ? `<span class="main-navigation__item-count">${filter.count}</span>` : ``}
  </a>`);
};

const createFiltersTemplate = (filters) => {
  const filtersMarkup = filters.map((filter) => createFilterMarkup(filter, filter.checked)).join(`\n`);

  return (`<nav class="main-navigation">
    ${filtersMarkup}
    <a href="#stats" data-menuType=${MenuType.STATS} class="main-navigation__item main-navigation__item--additional">Stats</a>
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
    const filtersTitleElement = this.getElement().querySelectorAll(`.main-navigation__item`);
    filtersTitleElement.forEach((filter) => {
      filter.addEventListener(`click`, () => {
        const filterName = filter.getAttribute(`href`);
        this._changeActiveFilter(filter);
        handler(filterName.substring(1));
      });
    });
  }

  _changeActiveFilter(newActiveFilter) {
    const oldActiveFilterElement = this.getElement().querySelector(`.main-navigation__item--active`);
    oldActiveFilterElement.classList.remove(`main-navigation__item--active`);
    newActiveFilter.classList.add(`main-navigation__item--active`);
  }
}
