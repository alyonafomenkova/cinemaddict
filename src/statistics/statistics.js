import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {ElementBuilder} from '../element-builder.js';
import moment from 'moment';

class Statistics {

  constructor(films) {
    this._watchedFilms = films.filter((it) => it.isWatched);
    this._genreChart = null;
    this._genreResult = null;
    this._genreCount = null;
    this._genreLabels = null;
    this._onFilterChange = this._onFilterChange.bind(this);
  }

  _getDataOfGenresForChart(array) {
    let map = new Map();

    for (let obj of array) {
      let key = obj.genre;

      if (map.has(key)) {
        let number = map.get(key);
        map.set(key, number + 1);
      } else {
        map.set(key, 1);
      }
    }

    return map;
  }

  _getTopGenre() {
    const maxPair = [...this._genreResult.entries()].reduce((prev, curr) => curr[1] > prev[1] ? curr : prev);
    const topGenre = maxPair[0];
    console.log("maxPair: ", maxPair);
    console.log("topGenre: ", topGenre);
    return topGenre;
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
    document.querySelector(`.statistic__item-text--count`).innerHTML = filteredFilms.length;
    //document.querySelector(`.statistic__item-text--top-genre`).innerHTML = filteredFilms.length;/////
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
    const statsComponent = ElementBuilder.buildStatistics(this._watchedFilms);
    container.appendChild(statsComponent);
    this._createChart(this._watchedFilms);
    document.querySelector(`.statistic__item-text--top-genre`).innerHTML = this._getTopGenre(this._watchedFilms);//
    //
    const dates = this._watchedFilms.map((it) => moment(it.userDate).format(`D MMMM YYYY`)); //
    console.log(`this._watchedFilms: `, this._watchedFilms);//
    console.log(`dates: `, dates);//


    statsComponent.querySelectorAll(`.statistic__filters-input`).forEach((it) =>
      it.addEventListener(`click`, this._onFilterChange)
    );
  }
}

export {Statistics};
