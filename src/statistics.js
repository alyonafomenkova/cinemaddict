import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {ElementBuilder} from './element-builder.js';

class Statistics {

  constructor(films) {
    this._films = films;
    this._genreChart = null;
    this._genreResult = null;
    this._genreCount = null;
    this._genreLabels = null;
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

  _getChartData() {
    this._genreResult = this._getDataOfGenresForChart(this._films);
    this._genreCount = Array.from(this._genreResult.values());
    this._genreLabels = [...this._genreResult.keys()];
    console.log(`this._genreResult: `, this._genreResult);
    console.log(`this._genreData: `, this._genreCount);
    console.log(`this._genreLabels: `, this._genreLabels);
  }

  renderCharts() {
    this._getChartData();
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
  }

  _onFilterChange() {
    console.log(`[STATISTICS] _onFilterChange`);
  }

  update(container) {
    const statsComponent = ElementBuilder.buildStatistics();
    container.appendChild(statsComponent);
    statsComponent.querySelectorAll(`.statistic__filters-input`).forEach((it) =>
      it.addEventListener(`click`, this._onFilterChange)
    );
  }
}

export {Statistics};
