const BAR_HEIGHT = 55;
const OFFERS_TO_SHOW_IN_TRIP_LIST = 3;

const EscKeyEvent = {
  ESCAPE: `Escape`,
  ESC: `Esc`
};

const SortType = {
  DEFAULT: `default`,
  PRICE: `price`,
  TIME: `time`
};

const UserAction = {
  UPDATE_POINT: `UPDATE_POINT`,
  ADD_POINT: `ADD_POINT`,
  DELETE_POINT: `DELETE_POINT`
};

const UpdateType = {
  PATCH: `PATCH`,
  MINOR: `MINOR`,
  MAJOR: `MAJOR`,
  INIT: `INIT`
};

const FilterType = {
  EVERYTHING: `everything`,
  FUTURE: `future`,
  PAST: `past`
};

const MenuItem = {
  ADD_NEW_POINT: `add-new-point`,
  TABLE: `table`,
  STATS: `stats`
};

export {BAR_HEIGHT, OFFERS_TO_SHOW_IN_TRIP_LIST, EscKeyEvent, SortType, UserAction, UpdateType, FilterType, MenuItem};
