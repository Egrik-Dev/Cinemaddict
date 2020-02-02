import AbstractComponent from './abstract-component.js';

const DEFAULT_SORT_TYPE = `Default`;

const createSortTemplate = () => {
  return (`<ul class="sort">
      <li><a href="#" class="sort__button sort__button--active" data-sort="Default">Sort by default</a></li>
      <li><a href="#" class="sort__button" data-sort="Date">Sort by date</a></li>
      <li><a href="#" class="sort__button" data-sort="Rating">Sort by rating</a></li>
    </ul>`);
};

export default class Sort extends AbstractComponent {
  getTemplate() {
    return createSortTemplate();
  }

  setSortClickHandler(handler) {
    const sortTypeElement = this.getElement().querySelectorAll(`.sort__button`);
    let activeSortType = DEFAULT_SORT_TYPE;
    sortTypeElement.forEach((sort) => {
      sort.addEventListener(`click`, () => {
        const sortName = sort.dataset.sort;

        if (activeSortType !== sortName) {
          activeSortType = sortName;
          this._changeActiveSort(sort);
          handler(sortName);
        }
      });
    });
  }

  _changeActiveSort(newActiveSort) {
    const oldActiveSortElement = this.getElement().querySelector(`.sort__button--active`);
    oldActiveSortElement.classList.remove(`sort__button--active`);
    newActiveSort.classList.add(`sort__button--active`);
  }
}
