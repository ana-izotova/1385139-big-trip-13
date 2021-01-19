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

const getTripRoute = (points) => {
  const cities = [...new Set(points.map((point) => point.destination.name))];

  return cities.length > 3 ?
    `${cities[0]} — ... — ${cities[cities.length - 1]}` :
    `${cities.join(` — `)}`;
};

const getTripDates = (points) => {
  const tripStartDate = points[0].startDate.format(`MMM D`);
  const tripEndDate = points[points.length - 1].endDate.format(`MMM D`);
  return [tripStartDate, tripEndDate];
};

const getTripCost = (points) => {
  return points.reduce(((pointsAcc, point) => {
    const pointOffersTotalPrice = point.offers
      .reduce(((offersAcc, offer) => offersAcc + offer.price), 0);
    return pointOffersTotalPrice + pointsAcc + point.price;
  }), 0);
};

const getDurationDays = (diffInMs) => {
  const timeDuration = dayjs.duration(diffInMs);
  const days = timeDuration.days();
  const hours = timeDuration.hours();

  return (days > 0 ? `${addZeroToNumber(days)}D ${addZeroToNumber(hours)}H` : `${addZeroToNumber(hours)}H`);
};

const defaultSortPointsByDate = (point1, point2) => point1.startDate.diff(point2.startDate);

const sortPointsByPrice = (point1, point2) => {
  return point2.price - point1.price;
};

const sortPointsByDuration = (point1, point2) => {
  const time1 = getEventDuration(point1.startDate, point1.endDate);
  const time2 = getEventDuration(point2.startDate, point2.endDate);
  return time2 - time1;
};

const isDatesEqual = (dateA, dateB) => {
  return (dateA === null && dateB === null) ? true : dayjs(dateA).isSame(dateB, `D`);
};

const getAvailableOffers = (allOffers, type) => {
  return allOffers
    .filter((offer) => offer.type === type)
    .map((offer) => offer.offers)[0];
};

export {getEventDuration, humanizeEventDuration, getTripRoute, getTripDates, getTripCost, defaultSortPointsByDate,
  sortPointsByPrice, sortPointsByDuration, isDatesEqual, getDurationDays, getAvailableOffers};
