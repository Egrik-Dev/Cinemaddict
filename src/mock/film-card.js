import {createCommentsList} from './comments.js';
import {getRandomInteger, getRandomUniqueItem} from '../utils.js';

const DATE_FIRST_MOVIE_RELEASE = 1888;
const MAX_RATING_FILM = 10;
const MAX_DURATION_IN_MINUTES = 210;
const HOUR_IN_MINUTES = 60;
const MAX_COMMENTS = 10;

const filmTitles = [
  `The Shawshank Redemption`,
  `The Green Mile`,
  `Forrest Gump`,
  `Schindler's List`,
  `Intouchables`,
  `Inception`,
  `Léon`,
  `The Lion King`,
  `Fight Club`,
  `Иван Васильевич меняет профессию`,
  `La vita è bella`,
  `Knockin' on Heaven's Door`,
  `The Godfather`,
  `Pulp Fiction`,
  `Операция «Ы» и другие приключения Шурика`];

const filmPosters = [
  `made-for-each-other.png`,
  `popeye-meets-sinbad.png`,
  `sagebrush-trail.jpg`,
  `santa-claus-conquers-the-martians.jpg`,
  `the-dance-of-life.jpg`,
  `the-great-flamarion.jpg`,
  `the-man-with-the-golden-arm.jpg`];

const filmTexts = [
  `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus. `,
  `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus. `,
  `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus. `];

const filmGenres = [
  `Musical`,
  `Western`,
  `Drama`,
  `Comedy`,
  `Cartoon`,
  `Mystery`];

const ageRatings = [
  `0+`,
  `6+`,
  `12+`,
  `16+`,
  `18+`
];

const getRandomRaiting = () => (Math.random() * MAX_RATING_FILM).toFixed(1);
const getCurrentYear = () => {
  const currentDate = new Date();
  return currentDate.getFullYear();
};
const getRandomDuration = () => {
  const durationInMinutes = getRandomInteger(0, MAX_DURATION_IN_MINUTES);
  const hours = Math.round(durationInMinutes / HOUR_IN_MINUTES);
  const minutes = durationInMinutes % HOUR_IN_MINUTES;
  return `${hours > 0 ? `${hours}h ` : ``}${minutes}m`;
};

const combineDescription = (arr) => {
  return arr.reduce((sum, current) => sum + current);
};

const getRandomBoolean = () => Math.random() > 0.5 ? true : false;

const generateFilm = () => {
  const film = {
    title: getRandomUniqueItem(filmTitles),
    rating: getRandomRaiting(),
    year: getRandomInteger(DATE_FIRST_MOVIE_RELEASE, getCurrentYear()),
    duration: getRandomDuration(),
    genre: filmGenres[getRandomInteger(0, filmGenres.length - 1)],
    poster: filmPosters[getRandomInteger(0, filmPosters.length - 1)],
    description: combineDescription(filmTexts.slice(getRandomInteger(0, filmTexts.length - 1))),
    comments: createCommentsList(getRandomInteger(0, MAX_COMMENTS)),
    emoji: null,
    ageRating: ageRatings[getRandomInteger(0, ageRatings.length - 1)],
    watchlist: getRandomBoolean(),
    watched: getRandomBoolean(),
    favorite: getRandomBoolean()
  };
  return film;
};

export const generateFilms = (count) => {
  return new Array(count)
  .fill(``)
  .map(generateFilm);
};
