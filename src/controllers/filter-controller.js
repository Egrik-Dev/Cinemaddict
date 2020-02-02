import {getMoviesByFilter, FilterType} from '../utils/filters-sort';
import FilterComponent from '../components/filter.js';
import {render, replace, RenderPosition} from '../utils/render.js';

export default class FilterController {
  constructor(container, moviesModel) {
    this._container = container;
    this._moviesModel = moviesModel;

    this._activeFilterType = FilterType.ALL;
    this._filterComponent = null;

    this._setFilterChangeHandler = this._setFilterChangeHandler.bind(this);
    this._setDataChangeHandler = this._setDataChangeHandler.bind(this);

    this._moviesModel.setDataChangeHandler(this._setDataChangeHandler);
  }

  render() {
    const container = this._container;
    const allFilms = this._moviesModel.getFilmsAll();
    const filters = Object.values(FilterType).map((filterType) => {
      return {
        name: filterType,
        count: getMoviesByFilter(allFilms, filterType).length,
        checked: this._activeFilterType === filterType,
      };
    });

    const oldFilterComponent = this._filterComponent;
    this._filterComponent = new FilterComponent(filters);
    this._filterComponent.setFilterClickHandler(this._setFilterChangeHandler);

    return (oldFilterComponent) ? replace(this._filterComponent, oldFilterComponent) : render(container, this._filterComponent, RenderPosition.BEFOREEND);
  }

  setMenuTypeClickHandler(handler) {
    this._container.addEventListener(`click`, (evt) => {
      if (!evt.target.classList.contains(`main-navigation__item`)) {
        return;
      }

      const menuType = evt.target.dataset.menutype;

      handler(menuType);
    });
  }

  _setFilterChangeHandler(filterType) {
    this._moviesModel.setFilter(filterType);
    this._activeFilterType = filterType;
  }

  _setDataChangeHandler() {
    this.render();
  }
}
