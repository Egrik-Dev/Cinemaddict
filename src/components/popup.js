import AbstractSmartComponent from './abstract-smart-component.js';
import {formatDuration, commentDate, formatReleaseDate} from '../utils/time.js';
import he from 'he';

const MAX_RATING = 9;
const SHAKE_ANIMATION_TIMEOUT = 600;

const RatingColor = {
  NORMAL: `#d8d8d8`,
  ERROR: `#ff0000`
};

const createCommentTemplate = (comments) => {
  comments.sort((a, b) => Date.parse(a.date) - Date.parse(b.date));
  return comments.map((comment) => {
    return (
      `<li class="film-details__comment" id="${comment.id}">
        <span class="film-details__comment-emoji">
          <img src="./images/emoji/${comment.emotion}.png" width="55" height="55" alt="emoji">
        </span>
        <div>
          <p class="film-details__comment-text">${he.encode(comment.comment)}</p>
          <p class="film-details__comment-info">
            <span class="film-details__comment-author">${comment.author}</span>
            <span class="film-details__comment-day">${commentDate(comment.date)}</span>
            <button class="film-details__comment-delete">Delete</button>
          </p>
        </div>
      </li>
    `);
  })
.join(`\n`);
};

const createRatingFields = (personalRating) => {
  const ratings = new Array(MAX_RATING).fill(``);
  return ratings.map((rating, index) => {
    return (`<input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="${index + 1}" id="rating-${index + 1}" ${(personalRating === index + 1) ? `checked` : ``}>
    <label class="film-details__user-rating-label" for="rating-${index + 1}">${index + 1}</label>
    `);
  })
.join(`\n`);
};

const createRatingFilmTemplate = (personalRating, poster, title) => {
  return (`<div class="form-details__middle-container">
      <section class="film-details__user-rating-wrap">
        <div class="film-details__user-rating-controls">
          <button class="film-details__watched-reset" type="button">Undo</button>
        </div>

        <div class="film-details__user-score">
          <div class="film-details__user-rating-poster">
            <img src="${poster}" alt="film-poster" class="film-details__user-rating-img">
          </div>

          <section class="film-details__user-rating-inner">
            <h3 class="film-details__user-rating-title">${title}</h3>

            <p class="film-details__user-rating-feelings">How you feel it?</p>

            <div class="film-details__user-rating-score">
            ${createRatingFields(personalRating)}
            </div>
          </section>
        </div>
      </section>
    </div>`);
};

const createSmileTemplate = (emotion) => {
  return (`<img src="images/emoji/${emotion}.png" width="55" height="55" alt="emoji">`);
};

const createFilmPopupTemplate = (film, options) => {
  const {title, alternativeTitle, totalRating, director, writers, actors, release, runtime, genre, poster, description, personalRating, comments, ageRating} = film;
  const {watchlist, alreadyWatched, favorite, emoji, textComment} = options;
  return (`<section class="film-details">
    <form class="film-details__inner" action="" method="get">
      <div class="form-details__top-container">
        <div class="film-details__close">
          <button class="film-details__close-btn" type="button">close</button>
        </div>
        <div class="film-details__info-wrap">
          <div class="film-details__poster">
            <img class="film-details__poster-img" src="${poster}" alt="">

            <p class="film-details__age">${ageRating}+</p>
          </div>

          <div class="film-details__info">
            <div class="film-details__info-head">
              <div class="film-details__title-wrap">
                <h3 class="film-details__title">${title}</h3>
                <p class="film-details__title-original">Original: ${alternativeTitle}</p>
              </div>

              <div class="film-details__rating">
                <p class="film-details__total-rating">${totalRating}</p>
                ${(alreadyWatched) ? `<p class="film-details__user-rating">Your rate ${personalRating}</p>` : ``}
              </div>
            </div>

            <table class="film-details__table">
              <tr class="film-details__row">
                <td class="film-details__term">Director</td>
                <td class="film-details__cell">${director}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Writers</td>
                <td class="film-details__cell">${writers.join(`, `)}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Actors</td>
                <td class="film-details__cell">${actors.join(`, `)}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Release Date</td>
                <td class="film-details__cell">${formatReleaseDate(release.date)}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Runtime</td>
                <td class="film-details__cell">${formatDuration(runtime)}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Country</td>
                <td class="film-details__cell">${release.release_country}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">${(genre.length > 1) ? `Genres` : `Genre`}</td>
                <td class="film-details__cell">
                  <span class="film-details__genre">${genre.join(`, `)}</span>
              </tr>
            </table>

            <p class="film-details__film-description">
              ${description}
            </p>
          </div>
        </div>

        <section class="film-details__controls">
          <input type="checkbox" class="film-details__control-input visually-hidden" id="watchlist" name="watchlist" ${watchlist ? `checked` : ``}>
          <label for="watchlist" class="film-details__control-label film-details__control-label--watchlist">Add to watchlist</label>

          <input type="checkbox" class="film-details__control-input visually-hidden" id="watched" name="watched" ${alreadyWatched ? `checked` : ``}>
          <label for="watched" class="film-details__control-label film-details__control-label--watched">Already watched</label>

          <input type="checkbox" class="film-details__control-input visually-hidden" id="favorite" name="favorite" ${favorite ? `checked` : ``}>
          <label for="favorite" class="film-details__control-label film-details__control-label--favorite">Add to favorites</label>
        </section>
      </div>
      ${alreadyWatched ? createRatingFilmTemplate(personalRating, poster, title) : ``}
      <div class="form-details__bottom-container">
        <section class="film-details__comments-wrap">
          <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments.length}</span></h3>

          <ul class="film-details__comments-list">
            ${createCommentTemplate(comments)}
          </ul>

          <div class="film-details__new-comment">
            <div for="add-emoji" class="film-details__add-emoji-label">
              ${emoji ? createSmileTemplate(emoji) : ``}
            </div>
            <label class="film-details__comment-label">
              <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment">${(textComment) ? textComment : ``}</textarea>
            </label>

            <div class="film-details__emoji-list">
              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="sleeping">
              <label class="film-details__emoji-label" for="emoji-smile">
                <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
              </label>

              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="neutral-face">
              <label class="film-details__emoji-label" for="emoji-sleeping">
                <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
              </label>

              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="grinning">
              <label class="film-details__emoji-label" for="emoji-puke">
                <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
              </label>

              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="grinning">
              <label class="film-details__emoji-label" for="emoji-angry">
                <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
              </label>
            </div>
          </div>
        </section>
      </div>
    </form>
  </section>`);
};

export default class PopUp extends AbstractSmartComponent {
  constructor(film) {
    super();
    this._film = film;

    this.isWatched = film.alreadyWatched;
    this._isWatchlist = film.watchlist;
    this._isFavorite = film.favorite;

    this.emoji = null;
    this.currentComment = null;
    this._activeRating = null;
    this.ratingInputsElement = null;
    this._btnDelete = null;

    this._btnCloseClickHandler = null;
    this._setDeleteCommentClickHandler = null;
    this._setInputRatingClickHandler = null;
    this._setIsWatchedClickHandler = null;
    this._setUndoClickHandler = null;

    this._subscribeOnEvents();
  }

  getTemplate() {
    return createFilmPopupTemplate(this._film, {
      watchlist: this._isWatchlist,
      alreadyWatched: this.isWatched,
      favorite: this._isFavorite,
      emoji: this.emoji,
      textComment: this.currentComment
    });
  }

  setBtnCloseClickHandler(handler) {
    this.getElement().querySelector(`.film-details__close-btn`).addEventListener(`click`, handler);

    this._btnCloseClickHandler = handler;
  }

  setDeleteCommentClickHandler(handler) {
    const commentsDeleteElement = this.getElement().querySelectorAll(`.film-details__comment-delete`);
    commentsDeleteElement.forEach((btnDelete) => {
      btnDelete.addEventListener(`click`, (evt) => {
        evt.preventDefault();
        const idComment = evt.target.parentNode.parentNode.parentNode.id;
        this._btnDelete = evt.target;
        this._btnDelete.textContent = `Deleting…`;
        this._btnDelete.setAttribute(`disabled`, true);
        handler(idComment);
      });
    });

    this._setDeleteCommentClickHandler = handler;
  }

  setInputRatingClickHandler(handler) {
    if (this.isWatched) {
      this.ratingInputsElement = this.getElement().querySelectorAll(`.film-details__user-rating-input`);
      this.ratingInputsElement.forEach((ratingInput) => {
        ratingInput.addEventListener(`change`, (evt) => {
          if (this._activeRating) {
            this._activeRating.style.backgroundColor = RatingColor.NORMAL;
          }
          this._disableInputsRating();
          const currentRating = evt.target.value;
          this._activeRating = evt.target.nextElementSibling;
          handler(currentRating);
        });
      });
    }
    this._setInputRatingClickHandler = handler;
  }

  _disableInputsRating() {
    this.ratingInputsElement.forEach((ratingInput) => {
      ratingInput.setAttribute(`disabled`, true);
    });
  }

  enableInputsRating() {
    this.ratingInputsElement.forEach((ratingInput) => {
      ratingInput.removeAttribute(`disabled`);
    });
  }

  setIsWatchedClickHandler(handler) {
    this.getElement().querySelector(`.film-details__control-label--watched`)
      .addEventListener(`click`, handler);

    this._setIsWatchedClickHandler = handler;
  }

  setUndoClickHandler(handler) {
    const btnUndoElement = this.getElement().querySelector(`.film-details__watched-reset`);
    if (btnUndoElement) {
      btnUndoElement.addEventListener(`click`, handler);
    }

    this._setUndoClickHandler = handler;
  }

  disableCommentForm() {
    const commentAreaElement = this.getElement().querySelector(`.film-details__comment-input`);
    const emojisElement = this.getElement().querySelectorAll(`.film-details__emoji-item`);

    commentAreaElement.setAttribute(`disabled`, true);
    emojisElement.forEach((emoji) => emoji.setAttribute(`disabled`, true));
  }

  errorCommentForm() {
    const commentFormElement = this.getElement().querySelector(`.film-details__new-comment`);
    const commentAreaElement = this.getElement().querySelector(`.film-details__comment-input`);
    const emojisElement = this.getElement().querySelectorAll(`.film-details__emoji-item`);

    commentAreaElement.removeAttribute(`disabled`);
    emojisElement.forEach((emoji) => emoji.removeAttribute(`disabled`));
    commentAreaElement.style.border = `2px solid red`;
    commentFormElement.style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / 1000}s`;

    setTimeout(() => {
      commentFormElement.style.animation = ``;
      commentAreaElement.style.border = ``;
    }, SHAKE_ANIMATION_TIMEOUT);
  }

  errorRatingForm() {
    const ratingForm = this.getElement().querySelector(`.film-details__user-rating-score`);

    ratingForm.style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / 1000}s`;

    this.enableInputsRating();
    this._activeRating.style.backgroundColor = RatingColor.ERROR;

    setTimeout(() => {
      ratingForm.style.animation = ``;
    }, SHAKE_ANIMATION_TIMEOUT);
  }

  errorDeleteComment() {
    this._btnDelete.textContent = `Delete`;
    this._btnDelete.removeAttribute(`disabled`);
  }

  recoveryListeners() {
    this.setBtnCloseClickHandler(this._btnCloseClickHandler);
    this.setDeleteCommentClickHandler(this._setDeleteCommentClickHandler);
    this.setInputRatingClickHandler(this._setInputRatingClickHandler);
    this.setIsWatchedClickHandler(this._setIsWatchedClickHandler);
    this.setUndoClickHandler(this._setUndoClickHandler);
    this._subscribeOnEvents();
  }

  rerender() {
    super.rerender();
  }

  getData() {
    const formElement = this.getElement().querySelector(`.film-details__inner`);
    return new FormData(formElement);
  }

  _subscribeOnEvents() {
    const element = this.getElement();

    element.querySelector(`.film-details__control-label--watchlist`)
      .addEventListener(`click`, () => {
        this._isWatchlist = !this._isWatchlist;
      });

    element.querySelector(`.film-details__control-label--favorite`)
      .addEventListener(`click`, () => {
        this._isFavorite = !this._isFavorite;
      });

    const emojisElement = element.querySelectorAll(`.film-details__emoji-item`);
    emojisElement.forEach((emoji) => {
      emoji.addEventListener(`click`, (evt) => {
        this.emoji = evt.target.id.split(`-`)[1];

        this.rerender();
      });
    });

    const inputElement = element.querySelector(`.film-details__comment-input`);
    inputElement.addEventListener(`input`, (evt) => {
      this.currentComment = evt.target.value;
    });
  }
}
