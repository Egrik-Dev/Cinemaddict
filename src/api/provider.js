import Movie from '../models/movie.js';
import Comment from '../models/comment.js';

const SOME_USER = `Some user`;

export default class Provider {
  constructor(api, store) {
    this._api = api;
    this._store = store;
  }

  getFilms() {
    if (this.isOnline) {
      return this._api.getFilms()
        .then((films) => {
          films.forEach((film) => {
            this._store.setItem(film.id, film.toRAW());
          });
          return films;
        });
    }

    const storeMovies = Object.values(this._store.getAll());

    return Promise.resolve(Movie.parseMovies(storeMovies));
  }

  getComments(id) {
    if (this.isOnline) {
      return this._api.getComments(id)
        .then((comments) => {
          comments.forEach((comment) => {
            this._store.setCommentItem(id, comment.toRAW());
          });
          return comments;
        });
    }

    const storeMovies = Object.values(this._store.getAll());

    return Promise.resolve(Movie.parseMovies(storeMovies));
  }

  createComment(id, comment) {
    if (this.isOnline) {
      return this._api.createComment(id, comment)
        .then((newComment) => Comment.parseComment(newComment))
        .then((commentModel) => {
          this._store.setCommentItem(id, commentModel.toRAW());
          return commentModel;
        });
    }

    const fakeNewCommentId = Math.random() * 100;
    const fakeNewComment = Comment.parseComment(Object.assign({}, comment.toRAW(), {
      id: fakeNewCommentId,
      author: SOME_USER
    }));

    this._store.setItem(id, Object.assign({}, fakeNewComment.toRAW(), {offline: true}));

    return fakeNewComment;
  }

  updateFilm(id, movie) {
    if (this.isOnline) {
      return this._api.updateFilm(id, movie)
        .then((newFilm) => {
          // this._store.setItem(newFilm.id, newFilm.toRAW());
          return newFilm;
        });
    }

    const fakeUpdatedMovie = Movie.parseMovie(Object.assign({}, movie.toRAW(), {id}));

    this._store.setItem(id, Object.assign({}, fakeUpdatedMovie.toRAW(), {offline: true}));

    return Promise.resolve(fakeUpdatedMovie);
  }

  deleteComment(id) {
    if (this.isOnline) {
      return this._api.deleteComment(id);
    }

    return Promise.resolve();
  }

  isOnline() {
    return window.navigator.online;
  }
}
