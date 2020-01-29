import AbstractComponent from './abstract-component.js';
import {getTotalHours, getRestOfMinutes} from '../utils/time.js';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

const colorBar = {
  YELLOW: `#ffe125`
};

const FilterStitisticsTytle = {
  'all-time': `All time`,
  'today': `Today`,
  'week': `Week`,
  'month': `Month`,
  'year': `Year`,
};

const getTotalDuration = (films) => {
  return films.reduce((sum, current) => sum + current.runtime, 0);
};

const ChartSettings = {
  FONT_COLOR: `white`,
  FONT_FAMILY: `Open Sans`,
  FONT_SIZE: `18`,
  BAR_THICKNESS: 30,
  LABEL_ALIGN: `start`,
  LABEL_OFFSET: 25,
  TICKS_PADDING: 60,
};

const renderChart = (chartCtx, genres) => {
  Chart.defaults.global.defaultFontColor = ChartSettings.FONT_COLOR;
  Chart.defaults.global.defaultFontFamily = ChartSettings.FONT_FAMILY;
  Chart.defaults.global.defaultFontSize = ChartSettings.FONT_SIZE;

  const titles = [].concat(genres.map((item) => item[0]));
  const count = [].concat(genres.map((item) => item[1]));
  const colors = [].concat(genres.map(() => colorBar.YELLOW));
  return new Chart(chartCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: titles,
      datasets: [{
        data: count,
        backgroundColor: colors,
        barThickness: ChartSettings.BAR_THICKNESS,
      }]
    },
    options: {
      plugins: {
        datalabels: {
          align: ChartSettings.LABEL_ALIGN,
          anchor: ChartSettings.LABEL_ALIGN,
          offset: ChartSettings.LABEL_OFFSET,
        }
      },
      scales: {
        yAxes: [{
          ticks: {
            padding: ChartSettings.TICKS_PADDING,
            fontColor: ChartSettings.TICKS_COLOR,
          }
        }],
        xAxes: [{
          ticks: {
            beginAtZero: true,
            display: false
          },
          stacked: true,
          offset: true
        }]
      },
      legend: {
        display: false
      },
      tooltips: {
        enabled: false
      }
    }
  });
};

const createFilterStatisticsMarkup = (filter, isChecked) => {
  return (`<input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-${filter.name}" value="${filter.name}" ${(isChecked) ? `checked` : ``}>
  <label for="statistic-${filter.name}" data-statistic-type="${filter.name}" class="statistic__filters-label">${FilterStitisticsTytle[filter.name]}</label>`);
};

const createFilterStatisticsTemplate = (statisticsTypes) => {
  const filterStatisticsMarkup = statisticsTypes.map((statistic) => createFilterStatisticsMarkup(statistic, statistic.checked)).join(`\n`);

  return (`<form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
  <p class="statistic__filters-description">Show stats:</p>
    ${filterStatisticsMarkup}
  </form>`);
};

const createStatisticsTemplate = (films, activeStatisticsType, genres) => {
  const topGenre = (genres.length > 0) ? genres[0][0] : `-`;
  const totalDuration = getTotalDuration(films);
  const totalHours = getTotalHours(totalDuration);
  const restMinutes = getRestOfMinutes(totalDuration);
  return (`<section class="statistic">
  <p class="statistic__rank">
    Your rank
    <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
    <span class="statistic__rank-label">Sci-Fighter</span>
  </p>
  ${createFilterStatisticsTemplate(activeStatisticsType)}
  <ul class="statistic__text-list">
    <li class="statistic__text-item">
      <h4 class="statistic__item-title">You watched</h4>
<p class="statistic__item-text">${films.length}<span class="statistic__item-description">movies</span></p>
    </li>
    <li class="statistic__text-item">
      <h4 class="statistic__item-title">Total duration</h4>
<p class="statistic__item-text">${totalHours}<span class="statistic__item-description">h</span>${restMinutes}<span class="statistic__item-description">m</span></p>
    </li>
    <li class="statistic__text-item">
      <h4 class="statistic__item-title">Top genre</h4>
      <p class="statistic__item-text">${topGenre}</p>
    </li>
  </ul>

  <div class="statistic__chart-wrap">
    <canvas class="statistic__chart" width="1000"></canvas>
  </div>

</section>`);
};

export default class Films extends AbstractComponent {
  constructor(films, statisticsTypes, genres) {
    super();

    this._genres = genres;
    this._statisticsTypes = statisticsTypes;
    this._films = films;
  }

  getTemplate() {
    return createStatisticsTemplate(this._films, this._statisticsTypes, this._genres);
  }

  createChart() {
    const chartCtx = this.getElement().querySelector(`.statistic__chart`);
    renderChart(chartCtx, this._genres);
  }

  setStatisticClickHandler(handler) {
    const statElements = this.getElement().querySelectorAll(`.statistic__filters-label`);
    statElements.forEach((element) => {
      element.addEventListener(`click`, (evt) => {
        const statType = evt.target.dataset.statisticType;
        handler(statType);
      });
    });
  }
}
