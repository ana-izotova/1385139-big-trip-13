import {getTripDates, getTripRoute, getTripCost} from "./utils.js";

const createTripInfoTemplate = (cards) => {
  const tripRoute = getTripRoute(cards);
  const [tripStartDate, tripEndDate] = getTripDates(cards);
  const tripCost = getTripCost(cards);

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

export {createTripInfoTemplate};
