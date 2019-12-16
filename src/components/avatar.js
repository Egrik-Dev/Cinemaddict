import AbstractComponent from './abstract-component.js';

const countWatchedFilms = (films) => films.filter((film) => film.watched);

const userRank = (filmsCount) => {
  if (filmsCount === 0) {
    return ``;
  } else if (filmsCount >= 1 && filmsCount <= 10) {
    return `novice`;
  } else if (filmsCount > 10 && filmsCount <= 20) {
    return `fan`;
  } else {
    return `movie buff`;
  }
};

const createAvatarTemplate = (films) => {
  const numWatchedFilms = countWatchedFilms(films);
  const rank = userRank(numWatchedFilms.length);
  return (`<section class="header__profile profile">
      <p class="profile__rating">${rank}</p>
      <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
    </section>`);
};

export default class Avatar extends AbstractComponent {
  constructor(films) {
    super();
    this._films = films;
  }

  getTemplate() {
    return createAvatarTemplate(this._films);
  }
}
