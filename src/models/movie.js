import {parseToJson} from '../utils/time';

export default class Movie {
  constructor(movie) {
    this.id = movie[`id`];

    // Инфа по фильму
    this.title = movie.film_info[`title`];
    this.alternativeTitle = movie.film_info[`alternative_title`];
    this.totalRating = movie.film_info[`total_rating`];
    this.poster = movie.film_info[`poster`];
    this.ageRating = movie.film_info[`age_rating`];
    this.director = movie.film_info[`director`];
    this.writers = movie.film_info[`writers`];
    this.actors = movie.film_info[`actors`];
    this.release = movie.film_info[`release`];
    this.runtime = movie.film_info[`runtime`];
    this.genre = movie.film_info[`genre`];
    this.description = movie.film_info[`description`];

    // Инфа по юзеру
    this.personalRating = movie.user_details[`personal_rating`];
    this.watchlist = movie.user_details[`watchlist`];
    this.alreadyWatched = movie.user_details[`already_watched`];
    this.watchingDate = movie.user_details[`watching_date`] || parseToJson(Date.now());
    this.favorite = movie.user_details[`favorite`];

    // Комменты
    this.comments = movie[`comments`];
  }

  toRAW() {
    return {
      'id': this.id,
      'film_info': {
        'title': this.title,
        'alternative_title': this.alternativeTitle,
        'total_rating': this.totalRating,
        'poster': this.poster,
        'age_rating': this.ageRating,
        'director': this.director,
        'writers': this.writers,
        'actors': this.actors,
        'release': this.release,
        'runtime': this.runtime,
        'genre': this.genre,
        'description': this.description,
      },
      'user_details': {
        'personal_rating': this.personalRating,
        'watchlist': this.watchlist,
        'already_watched': this.alreadyWatched,
        'watching_date': this.watchingDate,
        'favorite': this.favorite,
      },
      'comments': []
    };
  }

  static parseMovie(data) {
    return new Movie(data);
  }

  static parseMovies(data) {
    return data.map(Movie.parseMovie);
  }

  static clone(data) {
    return new Movie(data.toRAW());
  }
}
