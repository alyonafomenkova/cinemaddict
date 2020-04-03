import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import moment from 'moment';
import {createElement, setUserRank} from '../util';

class Statistics {

  constructor(films) {
    this._userRank = ``;
    this._watchedFilms = films.filter((it) => it.isWatched);
    this._genreChart = null;
    this._genreResult = null;
    this._genreCount = null;
    this._genreLabels = null;
    this._onFilterChange = this._onFilterChange.bind(this);
  }

  get templateForStatistics() {
    return `
      <div>
        <p class="statistic__rank">Your rank <span class="statistic__rank-label">${this._updateUserRank(this._watchedFilms)}</span></p>

        <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
          <p class="statistic__filters-description">Show stats:</p>

          <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-all-time" value="all-time" checked>
          <label for="statistic-all-time" class="statistic__filters-label">All time</label>

          <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-today" value="today">
          <label for="statistic-today" class="statistic__filters-label">Today</label>

          <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-week" value="week">
          <label for="statistic-week" class="statistic__filters-label">Week</label>

          <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-month" value="month">
          <label for="statistic-month" class="statistic__filters-label">Month</label>

          <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-year" value="year">
          <label for="statistic-year" class="statistic__filters-label">Year</label>
        </form>

        <ul class="statistic__text-list">
          <li class="statistic__text-item">
            <h4 class="statistic__item-title">You watched</h4>
            <p class="statistic__item-text">
              <span class="statistic__item-text--count">${this._watchedFilms.length}</span>
              <span class="statistic__item-description">movie${this._watchedFilms.length === 1 ? `` : `s`}</span>
            </p>
          </li>
          <li class="statistic__text-item">
            <h4 class="statistic__item-title">Total duration</h4>
            <p class="statistic__item-text statistic__item-text--duration">
            ${Math.floor(moment.duration(this._calculateTotalDuration(this._watchedFilms), `m`).asHours())}<span class="statistic__item-description">h</span>
            ${moment.duration(this._calculateTotalDuration(this._watchedFilms), `m`).minutes()}<span class="statistic__item-description">m</span>
          </p>
          </li>
          <li class="statistic__text-item">
            <h4 class="statistic__item-title">Top genre</h4>
            <p class="statistic__item-text statistic__item-text--top-genre">${this._getTopGenre(this._watchedFilms)}</p>
          </li>
        </ul>

        <div class="statistic__chart-wrap">
          <canvas class="statistic__chart" width="1000"></canvas>
        </div>
      </div>`.trim();
  }

  _buildStatistics() {
    const template = this.templateForStatistics;
    const element = createElement(template);
    return element;
  }

  _updateUserRank(films) {
    this._userRank = setUserRank(films);
    return this._userRank;
  }

  _getDataOfGenresForChart(watchedFilms) {
    let map = new Map();

    watchedFilms.forEach((film) => {
      film.genre.forEach((currentGenre) => {
        if (map.has(currentGenre)) {
          let number = map.get(currentGenre);
          map.set(currentGenre, number + 1);
        } else {
          map.set(currentGenre, 1);
        }
      });
    });
    return map;
  }

  _getTopGenre(watchedFilms) {
    const genresMap = this._getDataOfGenresForChart(watchedFilms);
    if (genresMap.size === 0) {
      return ``;
    }
    const maxPair = [...genresMap.entries()].reduce((prev, curr) => curr[1] > prev[1] ? curr : prev);
    const topGenre = maxPair[0];
    return topGenre;
  }

  _calculateTotalDuration(watchedFilms) {
    const allDurations = watchedFilms.map((it) => it.duration);
    const totalDuration = allDurations.reduce((a, b) => a + b, 0);
    return totalDuration;
  }

  _getChartData(watchedFilms) {
    this._genreResult = this._getDataOfGenresForChart(watchedFilms);
    this._genreCount = Array.from(this._genreResult.values());
    this._genreLabels = [...this._genreResult.keys()];
  }

  _filterByTime(filter) {
    let filteredFilms;
    switch (filter) {
      case `all-time`:
        filteredFilms = this._watchedFilms;
        break;
      case `today`:
        filteredFilms = this._watchedFilms.filter((it) =>
          moment(it.userDate).format(`D MMMM YYYY`) === moment().format(`D MMMM YYYY`));
        break;
      case `week`:
        filteredFilms = this._watchedFilms.filter((it) =>
          moment(it.userDate).isAfter(moment().subtract(7, `days`)));
        break;
      case `month`:
        filteredFilms = this._watchedFilms.filter((it) =>
          moment(it.userDate).isAfter(moment().subtract(1, `months`)));
        break;
      case `year`:
        filteredFilms = this._watchedFilms.filter((it) =>
          moment(it.userDate).isAfter(moment().subtract(1, `year`)));
        break;
    }
    return filteredFilms;
  }

  _onFilterChange(evt) {
    const filter = evt.target.value;
    const filteredFilms = this._filterByTime(filter);
    this._genreChart.destroy();
    this._createChart(filteredFilms);
    document.querySelector(`.statistic__rank-label`).innerHTML = this._updateUserRank(filteredFilms);
    document.querySelector(`.statistic__item-text--count`).innerHTML = filteredFilms.length;
    document.querySelector(`.statistic__item-text--duration`).innerHTML = this._calculateTotalDuration(filteredFilms);
    document.querySelector(`.statistic__item-text--top-genre`).innerHTML = this._getTopGenre(filteredFilms);
  }

  _createChart(watchedFilms) {
    this._getChartData(watchedFilms);
    const statisticCtx = document.querySelector(`.statistic__chart`);
    const BAR_HEIGHT = 50;
    statisticCtx.height = BAR_HEIGHT * this._genreLabels.length;
    this._genreChart = new Chart(statisticCtx, {
      plugins: [ChartDataLabels],
      type: `horizontalBar`,
      data: {
        labels: this._genreLabels,
        datasets: [{
          data: this._genreCount,
          backgroundColor: `#ffe800`,
          hoverBackgroundColor: `#ffe800`,
          anchor: `start`
        }]
      },
      options: {
        plugins: {
          datalabels: {
            font: {
              size: 20
            },
            color: `#ffffff`,
            anchor: `start`,
            align: `start`,
            offset: 40,
          }
        },
        scales: {
          yAxes: [{
            ticks: {
              fontColor: `#ffffff`,
              padding: 100,
              fontSize: 20
            },
            gridLines: {
              display: false,
              drawBorder: false
            },
            barThickness: 24
          }],
          xAxes: [{
            ticks: {
              display: false,
              beginAtZero: true
            },
            gridLines: {
              display: false,
              drawBorder: false
            },
          }],
        },
        legend: {
          display: false
        },
        tooltips: {
          enabled: false
        }
      }
    });
    this._genreChart.update();
  }

  render(container) {
    const statsComponent = this._buildStatistics();
    container.appendChild(statsComponent);
    this._createChart(this._watchedFilms);

    statsComponent.querySelectorAll(`.statistic__filters-input`).forEach((it) =>
      it.addEventListener(`click`, this._onFilterChange)
    );
  }
}

export {Statistics};
