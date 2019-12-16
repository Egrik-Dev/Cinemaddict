import AbstractComponent from './abstract-component.js';

const createShowmoreBtnTemplate = () => (`<button class="films-list__show-more">Show more</button>`);

export default class ShowMore extends AbstractComponent {
  getTemplate() {
    return createShowmoreBtnTemplate();
  }

  setShowMoreClickHandler(handler) {
    this.getElement().addEventListener(`click`, handler);
  }
}
