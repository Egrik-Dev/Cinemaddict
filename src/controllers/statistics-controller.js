import StatisticsComponent from '../components/statistics.js';
import {render, RenderPosition, replace} from '../utils/render.js';
import {getGenresList} from '../utils/filters-sort.js';
import {StatisticsType} from '../utils/const';
import {getDateFrom} from '../utils/time.js';

export default class StatisticsController {
  constructor(container, moviesModel) {
    this._container = container;
    this._moviesModel = moviesModel;

    this._statisticsComponent = null;
    this._onStatisticsTypeChange = this._onStatisticsTypeChange.bind(this);
    this._onDataChange = this._onDataChange.bind(this);

    this._activeStatisticsType = StatisticsType.ALL;
    this._moviesModel.setDataChangeHandler(this._onDataChange);
  }

  render() {
    const oldStatisticsComponent = this._statisticsComponent;
    const dateFrom = getDateFrom(this._activeStatisticsType);
    const films = this._moviesModel.getStatisticFilms(dateFrom);
    const genres = getGenresList(films);
    const statisticsTypes = Object.values(StatisticsType).map((statisticsType) => {
      return {
        name: statisticsType,
        checked: this._activeStatisticsType === statisticsType,
      };
    });

    this._statisticsComponent = new StatisticsComponent(films, statisticsTypes, genres);

    this._statisticsComponent.setStatisticClickHandler(this._onStatisticsTypeChange);
    if (oldStatisticsComponent) {
      replace(this._statisticsComponent, oldStatisticsComponent);
      this._statisticsComponent.createChart();
    } else {
      render(this._container, this._statisticsComponent, RenderPosition.BEFOREEND);
      this._statisticsComponent.createChart();
    }
  }

  show() {
    this._statisticsComponent.getElement().classList.remove(`visually-hidden`);
  }

  hide() {
    this._statisticsComponent.getElement().classList.add(`visually-hidden`);
  }

  _onStatisticsTypeChange(statisticsType) {
    this._activeStatisticsType = statisticsType;
    this.render();
  }

  _onDataChange() {
    this.render();
  }
}
