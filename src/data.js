
import {getRandomNumber, getRandomElement, getShuffledSubarray} from './util.js';

const DESCRIPTION_TEXT = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.`;
const DescriptionCount = {
  MIN: 1,
  MAX: 3
};
const numberOfDescription = getRandomNumber(DescriptionCount.MIN, DescriptionCount.MAX);
const title = [
  `Laura`, `Metropolis`, `King Kong`, `Rebecca`, `Casablanca`,
  `The 39 Steps`, `Modern Times`, `The Bride of Frankenstein`, `North by Northwest`, `Sunset Boulevard`,
  `All About Eve`, `Kind Hearts and Coronets`, `Chinatown`, `Mary Poppins`, `101 Dalmatians`
];
const posters = [`accused.jpg`, `blackmail.jpg`, `blue-blazes.jpg`, `fuga-da-new-york.jpg`, `moonrise.jpg`, `three-friends.jpg`];
const description = DESCRIPTION_TEXT.split(`. `);
const RatingInterval = {
  MIN: 2,
  MAX: 10,
  STEP: 0.1,
  USER_RATING_MIN: 1,
  USER_RATING_MAX: 9,
};
const generateRating = () => {
  const rating = [];
  for (let i = RatingInterval.MIN; i < RatingInterval.MAX; i = i + RatingInterval.STEP) {
    rating.push(i.toFixed(1));
  }
  return rating;
};
const ratingArray = generateRating();
const YearsInterval = {
  MIN: 1960,
  MAX: 2019
};
const DurationInterval = {
  MIN: 3600000,
  MAX: 10800000,
};
const genre = [`comedy`, `drama`, `horror`, `action`, `adventure`, `war`, `musical`, `historical`, `science`];
const CommentsCount = {
  MIN: 0,
  MAX: 150
};
const CountOfFilms = {
  COMMON: 7,
  EXTRA: 2,
  MIN: 0,
  MAX: 14
};
const generateFilm = () => ({
  title: getRandomElement(title),
  posters: getRandomElement(posters),
  description: getShuffledSubarray(description, numberOfDescription),
  totalRating: getRandomElement(ratingArray),
  userRating: getRandomNumber(RatingInterval.USER_RATING_MIN, RatingInterval.USER_RATING_MAX),
  year: getRandomNumber(YearsInterval.MIN, YearsInterval.MAX),
  duration: getRandomNumber(DurationInterval.MIN, DurationInterval.MAX),
  genre: getRandomElement(genre),
  commentsCount: getRandomNumber(CommentsCount.MIN, CommentsCount.MAX),
  comments: [
    {
      text: `So long-long story, boring!`,
      author: `Tim Macoveev`,
      emoji: `😴`,
      date: 1560955417474
    },
    {
      text: `Great!`,
      author: `Anna Kim`,
      emoji: `😀`,
      date: Date.now()
    }
  ]
});

const generateFilms = (count) => {
  const films = [];
  for (let i = 0; i < count; i++) {
    const film = generateFilm();
    films.push(film);
  }
  return films;
};

const generatedFilms = generateFilms(CountOfFilms.COMMON);

export {CountOfFilms, generatedFilms};
