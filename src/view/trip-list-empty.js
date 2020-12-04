import AbstractView from "./abstract.js";

const createEmptyTripListTemplate = () => {
  return `<p class="trip-events__msg">Click New Event to create your first point</p>`;
};

class TripListEmpty extends AbstractView {
  getTemplate() {
    return createEmptyTripListTemplate();
  }
}

export default TripListEmpty;
