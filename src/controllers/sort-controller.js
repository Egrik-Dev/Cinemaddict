import SortComponent from '../components/sort';
import {render, RenderPosition} from '../utils/render.js';

export default class SortController {
  constructor(container, moviesModel) {
    this._container = container;
    this._moviesModel = moviesModel;

    this._activeSortType = null;
    this._sortComponent = null;

    this._setSortChangeHandler = this._setSortChangeHandler.bind(this);
  }

  render() {
    this._sortComponent = new SortComponent();
    render(this._container, this._sortComponent, RenderPosition.BEFOREEND);

    this._sortComponent.setSortClickHandler(this._setSortChangeHandler);
  }

  show() {
    this._sortComponent.getElement().classList.remove(`visually-hidden`);
  }

  hide() {
    this._sortComponent.getElement().classList.add(`visually-hidden`);
  }

  _setSortChangeHandler(sortType) {
    this._moviesModel.setSort(sortType);
    this._activeSortType = sortType;
  }
}
