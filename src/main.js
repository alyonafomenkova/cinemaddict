import {generatedFilms, CountOfFilms} from './data.js';
import {getRandomNumber, getSubarray} from './util.js';
import makeFilter from './make-filter.js';
import {Film} from './film.js';
import {FilmDetails} from './film-details.js';
import {FilmStorage} from './film-storage.js';

const FILTERS = [
  {
    name: `All movies`,
    count: null,
    isChecked: true
  },
  {
    name: `Watchlist`,
    count: 13
  },
  {
    name: `History`,
    count: 4
  },
  {
    name: `Favorites`,
    count: 8
  }
];
const filtersContainer = document.querySelector(`.main-navigation`);
const filmsContainers = document.querySelectorAll(`.films-list__container`);
const commonFilmsContainer = filmsContainers[0];
const topRatedFilmsContainer = filmsContainers[1];
const mostCommentedFilmsContainer = filmsContainers[2];

const renderFilters = (filters) => {
  filters.reverse().forEach((item) => {
    filtersContainer.insertAdjacentHTML(`afterbegin`, makeFilter(item.name, item.count, item.isChecked));
  });
};

const renderFilms = (container, array) => {
  array.forEach(element => {
    const filmComponent = new Film(element);
    container.appendChild(filmComponent.render());

    const filmDetailsComponent = new FilmDetails(element);
    filmComponent.onClick = () => {
      body.appendChild(filmDetailsComponent.render());
    };});
};

const updateFilms = () => {
  const filtersList = filtersContainer.querySelectorAll(`.main-navigation__item`);
  const onFiltersClick = (evt) => {
    evt.preventDefault();
    const target = evt.target;
    const count = getRandomNumber(CountOfFilms.MIN, CountOfFilms.MAX);
    const newArray = getSubarray(generatedFilms, count);

    commonFilmsContainer.innerHTML = ``;
    renderFilms(commonFilmsContainer, newArray);

    filtersList.forEach((item) => {
      item.classList.remove(`main-navigation__item--active`);
    });
    target.classList.add(`main-navigation__item--active`);
  };

  filtersList.forEach((item) => {
    item.addEventListener(`click`, onFiltersClick);
  });
};

renderFilters(FILTERS);
renderFilms(commonFilmsContainer, generatedFilms);
renderFilms(topRatedFilmsContainer, generatedFilms);
renderFilms(mostCommentedFilmsContainer, generatedFilms);
updateFilms();


const body = document.querySelector(`body`);
//const filmComponent = new Film(generateFilm());
//const filmDetailsComponent = new FilmDetails(generateFilm());
// console.log(`filmComponent: `, filmComponent);
// console.log(`filmDetailsComponent: `, filmDetailsComponent);

//commonFilmsContainer.appendChild(filmComponent.render());

// filmComponent.onClick = () => {
//   body.appendChild(filmDetailsComponent.render());
// };

// filmDetailsComponent.onClick = () => {
//   //filmDetailsComponent.render();
//   //commonFilmsContainer.replaceChild(filmDetailsComponent.element, filmComponent.element);
//   //filmComponent.unrender();
//   body.removeChild(filmDetailsComponent);
//   filmDetailsComponent.unrender()
// };

const films = new FilmStorage();

const onError = () => {
  console.error(`Error loading films from server`);
}

const onSuccess = (films) => {
  console.log(`Films onSuccess: `, films);
}

films.load(onError, onSuccess);
