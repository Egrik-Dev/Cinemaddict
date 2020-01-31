import AbstractComponent from './abstract-component.js';

const RankUser = {
  NOVICE_FROM: 1,
  NOVICE_TO: 10,
  FAN_TO: 20
};

const countWatchedFilms = (films) => films.filter((film) => film.alreadyWatched);

const userRank = (filmsCount) => {
  if (filmsCount === 0) {
    return ``;
  } else if (filmsCount >= RankUser.NOVICE_FROM && filmsCount <= RankUser.NOVICE_TO) {
    return `novice`;
  } else if (filmsCount > RankUser.NOVICE_TO && filmsCount <= RankUser.FAN_TO) {
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
