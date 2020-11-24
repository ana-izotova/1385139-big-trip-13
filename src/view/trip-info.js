import {destinations} from "../mock/event-cards.js";

const createTripInfoTemplate = (cards) => {
  const tripRoute = destinations.length > 3 ?
    `${destinations[0]} — ... — ${destinations[destinations.length - 1]}` :
    `${destinations[0]} — ${destinations[1]} — ${destinations[2]}`;

  const tripStartDate = cards[0].startDate.format(`MMM D`);
  const tripEndDate = cards[cards.length - 1].endDate.format(`MMM D`);

  const tripCost = cards.reduce(((cardsAcc, card) => {
    const selectedOffersTotalPrice = card.offers
      .filter((offer) => offer.checked)
      .reduce(((offersAcc, offer) => offersAcc + offer.price), 0);
    return selectedOffersTotalPrice + cardsAcc + card.price;
  }), 0);


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
