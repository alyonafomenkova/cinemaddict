import {Provider} from "../provider";
import {Statistics} from './statistics.js';

const statsBtn = document.querySelector(`.main-navigation__item--additional`);
const statsContainer = document.querySelector(`.statistic`);
const filmsContainer = document.querySelector(`.films`);

const showStatistic = () => {
  const films = Provider.get().getRenderedFilms();
  const statsComponent = new Statistics(films);
  filmsContainer.classList.add(`visually-hidden`);
  statsContainer.innerHTML = ``;
  statsContainer.classList.remove(`visually-hidden`);
  statsComponent.render(statsContainer);
};

const hideStatistic = () => {
  statsContainer.classList.add(`visually-hidden`);
  filmsContainer.classList.remove(`visually-hidden`);
};

export {statsBtn, showStatistic, hideStatistic};
