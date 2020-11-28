import {createElement} from "./utils.js";

const createTripListTemplate = () => {
  return `<ul class="trip-events__list"></ul>`;
};

class TripList {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createTripListTemplate();
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

export default TripList;
