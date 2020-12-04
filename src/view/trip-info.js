import {getTripDates, getTripRoute, getTripCost} from "./utils.js";
import AbstractView from "./abstract.js";

const createTripInfoTemplate = (tripCards) => {
  const tripRoute = getTripRoute(tripCards);
  const [tripStartDate, tripEndDate] = getTripDates(tripCards);
  const tripCost = getTripCost(tripCards);

  return `<section class="trip-main__trip-info  trip-info">
            <div class="trip-info__main">
              <h1 class="trip-info__title">${tripRoute}</h1>

              <p class="trip-info__dates">${tripStartDate} — ${tripEndDate}</p>
            </div>

            <p class="trip-info__cost">
              Total: &euro;&nbsp;<span class="trip-info__cost-value">${tripCost}</span>
            </p>
          </section>`;
};

class TripInfo extends AbstractView {
  constructor(tripCards) {
    super();
    this._data = tripCards;
  }

  getTemplate() {
    return createTripInfoTemplate(this._data);
  }
}

export default TripInfo;
