import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
dayjs.extend(duration);

const addZeroToNumber = (number) => {
  return (number < 10 ? `0${number}` : number);
};

const getEventDuration = (startDate, endDate) => {
  return endDate.diff(startDate);
};

const humanizeEventDuration = (timeDiff) => {
  const eventDuration = dayjs.duration(timeDiff);
  const days = eventDuration.days();
  const hours = eventDuration.hours();
  const minutes = eventDuration.minutes();
  return `
      ${(days > 0 && addZeroToNumber(days) + `D`) || ``}
      ${((days > 0 || hours > 0) && addZeroToNumber(hours) + `H`) || ``}
      ${addZeroToNumber(minutes)}M
    `;
};

const getTripRoute = (cards) => {
  const cities = [...new Set(cards.map((card) => card.destination))];
  return cities.length > 3 ?
    `${cities[0]} — ... — ${cities[cities.length - 1]}` :
    `${cities.join(` — `)}`;
};

const getTripDates = (cards) => {
  const tripStartDate = cards[0].startDate.format(`MMM D`);
  const tripEndDate = cards[cards.length - 1].endDate.format(`MMM D`);
  return [tripStartDate, tripEndDate];
};

const getTripCost = (cards) => {
  return cards.reduce(((cardsAcc, card) => {
    const cardOffers = Object.values(card.offers);
    const selectedOffersTotalPrice = Object.values(cardOffers)
      .filter((offer) => offer.checked)
      .reduce(((offersAcc, offer) => offersAcc + offer.price), 0);
    return selectedOffersTotalPrice + cardsAcc + card.price;
  }), 0);
};

const sortTripCardsByPrice = (tripCard1, tripCard2) => {
  return tripCard2.price - tripCard1.price;
};

const sortTripCardsByDuration = (tripCard1, tripCard2) => {
  const time1 = getEventDuration(tripCard1.startDate, tripCard1.endDate);
  const time2 = getEventDuration(tripCard2.startDate, tripCard2.endDate);
  return time2 - time1;
};

export {getEventDuration, humanizeEventDuration, getTripRoute, getTripDates, getTripCost, sortTripCardsByPrice, sortTripCardsByDuration};
