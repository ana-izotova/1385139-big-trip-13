import {createElement} from "./utils.js";

const createEmptyTripListTemplate = () => {
  return `<p class="trip-events__msg">Click New Event to create your first point</p>`;
};

class TripListEmpty {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createEmptyTripListTemplate();
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

export default TripListEmpty;
