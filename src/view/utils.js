import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
dayjs.extend(duration);

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

export {getEventDuration, getRandomInt};
