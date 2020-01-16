import AbstractComponent from './abstract-component.js';

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
    const sortType = this.getElement().querySelectorAll(`.sort__button`);
    let activeSortType = `Default`;
    sortType.forEach((sort) => {
      sort.addEventListener(`click`, () => {
        const sortName = sort.dataset.sort;

        if (activeSortType !== sortName) {
          activeSortType = sortName;
          handler(sortName, sort);
        }
      });
    });
  }
}
