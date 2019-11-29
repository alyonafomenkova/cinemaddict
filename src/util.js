
const getRandomNumber = (min, max) => min + Math.floor(Math.random() * (max + 1 - min));

const getRandomElement = (array) => {
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

const getShuffledSubarray = (array, numberOfElements) => {
  const shuffledArr = shuffleArray(array);
  return shuffledArr.slice(0, numberOfElements);
};

const getSubarray = (array, numberOfElements) => {
  return array.slice(0, numberOfElements);
};

const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;
  return newElement.firstChild;
};

const checkExists = (value, message) => {
  if (value === null || typeof(value) === `undefined`) {
    throw new Error(message);
  }
  return value;
};

export {getRandomNumber, getRandomElement, getShuffledSubarray, getSubarray, createElement, checkExists};
