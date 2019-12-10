export const getRandomInteger = (min, max) => Math.floor(min + Math.random() * (max + 1 - min));

export const getRandomUniqueItem = (arr) => {
  const getIndex = getRandomInteger(0, arr.length - 1);
  const item = arr[getIndex];
  arr.splice(getIndex, 1);
  return item;
};

export const RenderPosition = {
  AFTERBEGIN: `afterbegin`,
  BEFOREEND: `beforeend`,
  AFTEREND: `afterend`
}

export const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;

  return newElement.firstChild;
};

export const render = (container, element, place) => {
  switch (place) {
    case RenderPosition.AFTERBEGIN:
      container.prepend(element);
      break;
    case RenderPosition.BEFOREEND:
      container.append(element);
      break;
    case RenderPosition.AFTEREND:
      container.after(element);
      break;
  }
}

export const isEscEvent = (evt, action) => {
  const ESC_KEYCODE = 27;
  if (evt.keyCode === ESC_KEYCODE) {
    action();
  }
}
