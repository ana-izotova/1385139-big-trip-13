import AbstractView from "./abstract.js";

const createTripListTemplate = () => {
  return `<ul class="trip-events__list"></ul>`;
};

class TripList extends AbstractView {
  getTemplate() {
    return createTripListTemplate();
  }
}

export default TripList;
