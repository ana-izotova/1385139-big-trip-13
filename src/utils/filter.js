import {FilterType} from "../const.js";

const today = Date.now();

const filter = {
  [FilterType.EVERYTHING]: (points) => points,
  [FilterType.FUTURE]: (points) => points.filter((point) => point.startDate.isAfter(today)),
  [FilterType.PAST]: (points) => points.filter((point) => point.endDate.isBefore(today))
};

export {filter};
