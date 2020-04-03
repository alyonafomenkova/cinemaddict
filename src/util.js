import {Rating} from './constants';

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
