import SortComponent from '../components/sort';
import {render, RenderPosition} from '../utils/render.js';

export default class SortController {
  constructor(container, moviesModel) {
    this._container = container;
    this._moviesModel = moviesModel;

    this._activeSortType = null;
    this._sortComponent = null;

    this._onSortChange = this._onSortChange.bind(this);
  }

  render() {
    this._sortComponent = new SortComponent();
    render(this._container, this._sortComponent, RenderPosition.BEFOREEND);

    this._sortComponent.setSortClickHandler(this._onSortChange);
  }

  _onSortChange(sortType, currentSort) {
    this._moviesModel.setSort(sortType);
    this._activeSortType = sortType;
    this._changeActiveSort(currentSort);
  }

  _changeActiveSort(newActiveSort) {
    const oldActiveSort = this._sortComponent.getElement().querySelector(`.sort__button--active`);
    oldActiveSort.classList.remove(`sort__button--active`);
    newActiveSort.classList.add(`sort__button--active`);
  }
}
