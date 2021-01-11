import {FilterType} from "../const.js";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(isSameOrAfter);
dayjs.extend(customParseFormat);

const today = dayjs().format(`YYYY-MM-DD`);

const isFutureDate = (date) => {
  const formattedDate = date.format(`YYYY-MM-DD`);
  return dayjs(formattedDate).isSameOrAfter(today, `date`);
};

const isPastDate = (date) => {
  const formattedDate = date.format(`YYYY-MM-DD`);
  return dayjs(formattedDate).isBefore(today, `date`);
};

const filter = {
  [FilterType.EVERYTHING]: (points) => points,
  [FilterType.FUTURE]: (points) => points.filter((point) => isFutureDate(point.startDate)),
  [FilterType.PAST]: (points) => points.filter((point) => isPastDate(point.endDate))
};

export {filter};
