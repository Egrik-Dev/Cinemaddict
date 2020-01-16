import {FilterType} from '../utils/const';
import {getMoviesByFilter} from '../utils/filters-sort';
import FilterComponent from '../components/filter.js';
import {render, replace, RenderPosition} from '../utils/render.js';

export default class FilterController {
  constructor(container, moviesModel) {
    this._container = container;
    this._moviesModel = moviesModel;

    this._activeFilterType = FilterType.ALL;
    this._filterComponent = null;

    this._onFilterChange = this._onFilterChange.bind(this);
    this._onDataChange = this._onDataChange.bind(this);

    this._moviesModel.setDataChangeHandler(this._onDataChange);
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
    this._filterComponent.setFilterClickHandler(this._onFilterChange); // Подписка на изменение View путём передачи колбэка во View

    return (oldFilterComponent) ? replace(this._filterComponent, oldFilterComponent) : render(container, this._filterComponent, RenderPosition.BEFOREEND);
  }

  _onFilterChange(filterType, currentFilter) {
    this._moviesModel.setFilter(filterType); // При изменении View запускается изменение model
    this._activeFilterType = filterType;
    this._changeActiveFilter(currentFilter);
  }

  _changeActiveFilter(newActiveFilter) {
    const oldActiveFilter = this._filterComponent.getElement().querySelector(`.main-navigation__item--active`);
    oldActiveFilter.classList.remove(`main-navigation__item--active`);
    newActiveFilter.classList.add(`main-navigation__item--active`);
  }

  _onDataChange() {
    this.render();
  }
}
