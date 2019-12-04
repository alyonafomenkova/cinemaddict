import {CountOfFilms} from './data.js';
import {getRandomNumber, getShuffledSubarray, getSubarray} from './util.js';
import makeFilter from './make-filter.js';
import {FilmStorage} from './film-storage.js';
import {ElementBuilder} from './element-builder.js';
import {createElement} from './util.js';//

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
const Group = {
  ALL: 0,
  TOP_RATED: 1,
  MOST_COMMENTED: 2
};
const films = new FilmStorage();

const renderFilters = (filters) => {
  filters.reverse().forEach((item) => {
    filtersContainer.insertAdjacentHTML(`afterbegin`, makeFilter(item.name, item.count, item.isChecked));
  });
};

const updateFilms = () => {
  const filtersList = filtersContainer.querySelectorAll(`.main-navigation__item`);
  const onFiltersClick = (evt) => {
    evt.preventDefault();
    const target = evt.target;
    const count = getRandomNumber(CountOfFilms.MIN, CountOfFilms.MAX);
    const newArray = getSubarray(films._films, count);

    commonFilmsContainer.innerHTML = ``;
    renderFilms(commonFilmsContainer, newArray, Group.ALL);

    filtersList.forEach((item) => {
      item.classList.remove(`main-navigation__item--active`);
    });
    target.classList.add(`main-navigation__item--active`);
  };

  filtersList.forEach((item) => {
    item.addEventListener(`click`, onFiltersClick);
  });
};

const renderFilms = (container, filmsArray, group) => {
  const body = document.querySelector(`body`);

  filmsArray.forEach((film) => {
    const overlay = ElementBuilder.createOverlay();

    const onDetailedFilmClick = () => {
      body.removeChild(detailedFilmComponent);
      body.removeChild(overlay);
    };

    const onSmallFilmClick = () => {
      body.appendChild(overlay);
      body.appendChild(detailedFilmComponent);

      ////////////////////////////////////////////////////////////////////////////////////////////////////////////
      const emojiList = detailedFilmComponent.querySelector(`.film-details__emoji-list`);

      const onEmojiClick = () => {
        const emoji = emojiList.querySelector(`.film-details__emoji-item:checked + label`).textContent;
        const previewEmoji = detailedFilmComponent.querySelector(`.film-details__add-emoji-label`);
        previewEmoji.innerHTML = emoji;
      };

      emojiList.addEventListener(`click`, onEmojiClick);

      function sendCommentListener (evt) {
        const commentField = detailedFilmComponent.querySelector(`.film-details__comment-input`);
        const commentsContainer = detailedFilmComponent.querySelector(`.film-details__comments-list`);


        if (evt.ctrlKey && evt.keyCode === 13 && commentField.value) {
          //const formData = new FormData(detailedFilmComponent.querySelector(`.film-details__inner`));
          //console.log(`formData: `, formData);
          const comment = {};
          comment.emoji = detailedFilmComponent.querySelector(`.film-details__emoji-item:checked + label`).textContent;;
          comment.text = commentField.value;
          comment.author = `Leo Tolstoy`;
          comment.date = Date.now();
          console.log(`comment: `, comment);
          const commentElement = createElement(ElementBuilder.templateForFilmComment(comment));
          commentsContainer.appendChild(commentElement);

          detailedFilmComponent.querySelector(`.film-details__add-emoji`).checked = false;
          commentField.value = ``;
        }
      }

      const commentComponent = ElementBuilder.buildFilmCommentElement(film.comments, sendCommentListener);

      const onRatingClick = () => {
        console.log(`onRatingClick`);
        const userRating = detailedFilmComponent.querySelector(`.film-details__user-rating-input:checked`).value;
        detailedFilmComponent.querySelector(`.film-details__user-rating span`).innerHTML = userRating;
      };

      detailedFilmComponent.querySelector(`.film-details__user-rating-score`).addEventListener(`click`, onRatingClick);
      ////////////////////////////////////////////////////////////////////////////////////////////////////////////
    };

    let filmComponent;

    switch (group) {
      case Group.ALL:
        filmComponent = ElementBuilder.buildSmallFilmElement(film, onSmallFilmClick);
        break;
      case Group.TOP_RATED:
        filmComponent = ElementBuilder.buildExtraSmallFilmElement(film, onSmallFilmClick);
        break;
      case Group.MOST_COMMENTED:
        filmComponent = ElementBuilder.buildExtraSmallFilmElement(film, onSmallFilmClick);
        break;
      default:
        throw new Error(`Unknown group type: ${group}`);
    }

    const detailedFilmComponent = ElementBuilder.buildDetailedFilmElement(film, onDetailedFilmClick);
    container.appendChild(filmComponent);
  });
};

const onError = () => {
  throw new Error(`ERROR LOADING`);
};

const onSuccess = (filmsArray) => {
  const topRatedFilms = getShuffledSubarray(filmsArray, CountOfFilms.EXTRA);
  const mostCommentedFilms = getShuffledSubarray(filmsArray, CountOfFilms.EXTRA);

  renderFilms(commonFilmsContainer, filmsArray, Group.ALL);
  renderFilms(topRatedFilmsContainer, topRatedFilms, Group.TOP_RATED);
  renderFilms(mostCommentedFilmsContainer, mostCommentedFilms, Group.MOST_COMMENTED);
};

renderFilters(FILTERS);
films.load(onError, onSuccess);
updateFilms();
