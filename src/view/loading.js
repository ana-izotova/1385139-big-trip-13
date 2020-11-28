import {createElement} from "./utils.js";

const createLoadingTemplate = () => {
  return `<p class="trip-events__msg">Loading...</p>`;
};

class Loading {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createLoadingTemplate();
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}

export default Loading;
