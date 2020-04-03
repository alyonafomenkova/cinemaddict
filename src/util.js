import {Provider} from "./provider";
import {Rating} from "./constants";

export const getRandomNumber = (min, max) => min + Math.floor(Math.random() * (max + 1 - min));

export const getRandomElement = (array) => {
  const rand = Math.floor(Math.random() * array.length);
  return array[rand];
};

const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

export const getShuffledSubarray = (array, numberOfElements) => {
  const shuffledArr = shuffleArray(array);
  return shuffledArr.slice(0, numberOfElements);
};

export const getSubarray = (array, numberOfElements) => {
  return array.slice(0, numberOfElements);
};

export const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;
  return newElement.firstChild;
};

export const checkExists = (value, message) => {
  if (value === null || typeof (value) === `undefined`) {
    throw new Error(message);
  }
  return value;
};

export const getRandomDate = (start, end) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

export const objectToArray = (object) => {
  return Object.keys(object).map((id) => object[id]);
};

export const setUserRank = (films) => {
  const count = (films.filter((film) => film.isWatched)).length;
  let userRank = ``;
  if (count < Rating.low.count.min) {
    userRank = ``;
  } else if (count <= Rating.low.count.max) {
    userRank = Rating.low.name;
  } else if (count <= Rating.medium.count) {
    userRank = Rating.medium.name;
  } else {
    userRank = Rating.high.name;
  }
  return userRank;
};
