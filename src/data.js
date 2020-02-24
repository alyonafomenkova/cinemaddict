
import {getRandomNumber, getRandomElement, getShuffledSubarray, getRandomDate} from './util.js';

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
  STEP: 0.1
};
const UserRating = {
  MIN: 1,
  MAX: 9
};
const generateRating = () => {
  const rating = [];
  for (let i = RatingInterval.MIN; i < RatingInterval.MAX; i = i + RatingInterval.STEP) {
    rating.push(i.toFixed(1));
  }
  return rating;
};
const ratingArray = generateRating();
const genre = [`comedy`, `drama`, `horror`, `action`, `adventure`, `war`, `musical`, `historical`, `science`];
const director = [
  `Errol Morris`, `Steven Soderbergh`, `Steven Spielberg`, `David Fincher`, `Luc Besson`, `Christopher Nolan`,
  `David Lynch`, `Quentin Tarantino`, `Lynne Ramsay`
];
const writer = [`Stephen King`, `Nora Ephron`, `Woody Allen`, `Quentin Tarantino`, `Chuck Palahniuk`, `Charlie Kaufman`, `William Goldman`, `Ernest Lehman`];
const actors = [
  `Leonardo DiCaprio`, `Brad Pitt`, `Sophie Marceau`, `Penélope Cruz`, `Keira Knightley`, `Lena Headey`, `Vincent Perez`, `John Travolta`,
  `Samuel L. Jackson`, `Tim Roth`, `Christoph Waltz`,
];
const ACTORS_COUNT = 4;
const country = [`USA`, `France`, `Germany`, `Italy`, `Spain`];
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
let filmId = 0;
const generateFilmsData = () => ({
  id: filmId++,
  title: getRandomElement(title),
  posters: getRandomElement(posters),
  description: getShuffledSubarray(description, numberOfDescription),
  rating: getRandomElement(ratingArray),
  userRating: getRandomNumber(UserRating.MIN, UserRating.MAX),
  director: getRandomElement(director),
  writer: getRandomElement(writer),
  actors: getShuffledSubarray(actors, ACTORS_COUNT),
  country: getRandomElement(country),
  year: getRandomDate(new Date(1970, 0, 1), new Date()),
  duration: getRandomNumber(5280000, 11700000),
  genre: getRandomElement(genre),
  restriction: [2, 6, 12, 16, 18][Math.floor(Math.random() * 5)],
  comments: [
    {
      text: `So long-long story, boring!`,
      author: `Tim Macoveev`,
      emoji: `😴`,
      date: Date.now()
    }
  ],
  isOnWatchlist: false,
  isWatched: false,
  isFavorite: false
});

const generateFilms = (count) => {
  const films = [];
  for (let i = 0; i < count; i++) {
    const film = generateFilmsData();
    films.push(film);
  }
  return films;
};

export {CountOfFilms, generateFilms};
