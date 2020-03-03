import Movie from '../models/movie.js';
import Comment from '../models/comment.js';

const SOME_USER = `Some user`;

// const getSyncedFilms = (items) => items.filter(({success}) => success).map(({playload}) => playload.film);

export default class Provider {
  constructor(api, store) {
    this._api = api;
    this._store = store;
    this._isSynchronized = true;
    this._createdOfflineComments = [];
  }

  getFilms() {
    if (this.isOnline()) {
      return this._api.getFilms()
        .then((films) => {
          films.forEach((film) => {
            this._store.setItem(film.id, film.toRAW());
          });
          return films;
        });
    }

    const storeMovies = Object.values(this._store.getAll());

    this._isSynchronized = false;

    return Promise.resolve(Movie.parseMovies(storeMovies));
  }

  getComments(id) {
    if (this.isOnline()) {
      return this._api.getComments(id)
        .then((comments) => {
          comments.forEach((comment) => {
            comment.toRAW();
          });
          this._store.setComments(id, comments);
          return comments;
        });
    }

    const store = this._store.getAll();

    this._isSynchronized = false;

    if (store[id][`comments`].length === 0) {
      return Promise.resolve([]);
    } else {
      return Promise.resolve(Comment.parseComments(store[id][`comments`]));
    }
  }

  createComment(id, comment) {
    if (this.isOnline()) {
      return this._api.createComment(id, comment)
        .then((newComment) => Comment.parseComment(newComment))
        .then((commentModel) => {
          this._store.setCommentItem(id, commentModel.toRAW());
          return commentModel;
        });
    }

    this._createdOfflineComments.push([id, comment]);

    const fakeNewCommentId = Math.random() * 100;
    const fakeNewComment = Comment.parseComment(Object.assign({}, comment.toRAW(), {
      id: String(fakeNewCommentId),
      author: SOME_USER
    }));
    this._isSynchronized = false;

    this._store.setCommentItem(id, Object.assign({}, fakeNewComment.toRAW(), {offline: true}));

    return Promise.resolve(fakeNewComment);
  }

  updateFilm(id, movie) {
    if (this.isOnline()) {
      return this._api.updateFilm(id, movie)
        .then((newFilm) => {
          this._store.setItem(newFilm.id, newFilm.toRAW());
          return newFilm;
        });
    }

    const fakeUpdatedMovie = Movie.parseMovie(Object.assign({}, movie.toRAW(), {id}));
    const cacheComments = this._store.getComments(id);
    fakeUpdatedMovie.comments = cacheComments;

    this._isSynchronized = false;

    this._store.setItem(id, Object.assign({}, fakeUpdatedMovie.toRAW(), {offline: true}));

    return Promise.resolve(fakeUpdatedMovie);
  }

  deleteComment(idComment, idFilm) {
    if (this.isOnline()) {
      return this._api.deleteComment(idComment)
          .then(() => {
            this._store.removeComment(idFilm, idComment);
          });
    }
    this._isSynchronized = false;

    this._store.removeComment(idFilm, idComment);

    return Promise.resolve();
  }

  sync() {
    if (this.isOnline()) {
      const storeFilms = Object.values(this._store.getAll());

      const deleteComments = [];

      storeFilms.forEach((film) => {
        film[`comments`].forEach((comment) => {
          if (comment.state && comment.state === `deleted`) {
            deleteComments.push(comment.id);
          }
        });
      });


      deleteComments.forEach((comment) => {
        this._api.deleteComment(comment);
      });

      this._createdOfflineComments.forEach((comment) => {
        this._api.createComment(comment[0], comment[1]);
      });

      this._createdOfflineComments = [];

      return this._api.sync(storeFilms)
        .then((response) => {
          response.updated.forEach((film) => {
            this._store.setItem(film.id, film);
          });

          this._isSynchronized = true;

          return Promise.resolve();
        });
    }

    return Promise.reject(new Error(`Sync data failed`));
  }

  getSynchronize() {
    return this._isSynchronized;
  }

  isOnline() {
    return window.navigator.onLine;
  }
}
