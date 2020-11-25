import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
dayjs.extend(duration);

const renderTemplate = (container, content, position = `beforeend`) => {
  container.insertAdjacentHTML(position, content);
};

const getRandomInt = (min = 0, max = 1) => {
  const lower = Math.ceil(Math.min(min, max));
  const upper = Math.floor(Math.max(min, max));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

const addZeroToNumber = (number) => {
  return (number < 10 ? `0${number}` : number);
};

const getEventDuration = (startDate, endDate) => {
  const diffInMs = endDate.diff(startDate);
  const timeDuration = dayjs.duration(diffInMs);
  const days = timeDuration.days();
  const hours = timeDuration.hours();
  const minutes = timeDuration.minutes();
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
    const selectedOffersTotalPrice = card.offers
      .filter((offer) => offer.checked)
      .reduce(((offersAcc, offer) => offersAcc + offer.price), 0);
    return selectedOffersTotalPrice + cardsAcc + card.price;
  }), 0);
};

export {renderTemplate, getEventDuration, getRandomInt, getTripRoute, getTripDates, getTripCost};
