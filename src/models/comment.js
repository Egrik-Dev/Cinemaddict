export default class Comment {
  constructor(comment) {
    this.id = comment[`id`];
    this.author = comment[`author`];
    this.emotion = comment[`emotion`];
    this.comment = comment[`comment`];
    this.date = comment[`date`];
  }

  static parseComment(data) {
    return new Comment(data);
  }

  static parseComments(data) {
    return data.map(Comment.parseComment);
  }
}
