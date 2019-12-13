export const getRandomInteger = (min, max) => Math.floor(min + Math.random() * (max + 1 - min));

export const getRandomUniqueItem = (arr) => {
  const getIndex = getRandomInteger(0, arr.length - 1);
  const item = arr[getIndex];
  arr.splice(getIndex, 1);
  return item;
};

export const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;

  return newElement.firstChild;
};

export const isEscEvent = (evt) => {
  const ESC_KEYCODE = 27;
  return evt.keyCode === ESC_KEYCODE;
}
