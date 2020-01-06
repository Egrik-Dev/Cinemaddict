import {getRandomInteger} from '../utils.js';
import {createSecondSign} from '../utils/const';

const author = [`Bernard`, `Leonardo`, `Mrs. Stinky`, `The best man`, `Jhony Sambrero`];

const emoji = [`smile`, `sleeping`, `puke`, `angry`];

const textComments = {
  smile: [
    `Interesting setting and a good cast`,
    `The film is just sweetie`,
    `Finally I waited! This is an awesome movie!`,
    `Who would have thought that the killer was actually a butler?`,
    `Watched by the whole family. Unforgettable movie`],
  sleeping: [
    `Booooooooooring`,
    `Only wasted money. I almost fell asleep`
  ],
  puke: [
    `Very very old. Meh`,
    `What a terrible acting game`
  ],
  angry: [
    `Almost two hours? Seriously?`,
    `I hope this director made his last film`
  ]
};

const getRanomDate = () => {
  let date = new Date();
  date.setDate(date.getDate() + (-1 * getRandomInteger(0, 10)));
  return `${date.getFullYear()}-${date.getMonth() + 1}-${createSecondSign(date.getDate())}T${createSecondSign(date.getHours())}:${createSecondSign(date.getMinutes())}:${createSecondSign(date.getSeconds())}.${date.getMilliseconds()}Z`;
};

let coundId = 0;

const generateComment = () => {
  const randomEmotion = emoji[getRandomInteger(0, emoji.length - 1)];

  const comment = {
    id: coundId++,
    author: author[getRandomInteger(0, author.length - 1)],
    emotion: randomEmotion,
    comment: textComments[randomEmotion][getRandomInteger(0, textComments[randomEmotion].length - 1)],
    date: getRanomDate()
  };

  return comment;
};

export const createCommentsList = (count) => {
  return new Array(count)
  .fill(``)
  .map(generateComment);
};
