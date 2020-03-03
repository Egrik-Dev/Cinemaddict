export default class Comment {
  constructor(comment) {
    this.id = comment[`id`];
    this.author = comment[`author`];
    this.emotion = comment[`emotion`];
    this.comment = comment[`comment`];
    this.date = comment[`date`];
    this.state = comment[`state`] || `initial`;
  }

  toRAW() {
    return {
      'id': this.id,
      'author': this.author,
      'emotion': this.emotion,
      'comment': this.comment,
      'date': this.date
    };
  }

  static parseComment(data) {
    return new Comment(data);
  }

  static parseComments(data) {
    return data.map(Comment.parseComment);
  }
}
