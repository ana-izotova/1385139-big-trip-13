import TripBoardPresenter from "./presenter/trip-board.js";
import TripInfoPresenter from "./presenter/info.js";
import FilterPresenter from "./presenter/filter.js";
import MenuPresenter from "./presenter/menu.js";
import PointsModel from "./model/points.js";
import FilterModel from "./model/filter.js";

import StatsPresenter from "./presenter/stats.js";
import {MenuItem, UpdateType, FilterType} from "./const.js";
import {cards} from "./mock/event-cards.js";

const pointsModel = new PointsModel();
pointsModel.setPoints(cards);

const filterModel = new FilterModel();

const tripMainContainer = document.querySelector(`.trip-main`);
const tripControlsContainer = tripMainContainer.querySelector(`.trip-main__trip-controls`);

const pageMain = document.querySelector(`.page-body__page-main`);
const tripEventsContainer = pageMain.querySelector(`.trip-events`);
const pageBodyContainer = pageMain.querySelector(`.page-body__container`);

const tripBoardPresenter = new TripBoardPresenter(tripEventsContainer, pointsModel, filterModel);
const tripInfoPresenter = new TripInfoPresenter(tripMainContainer, pointsModel);
const menuPresenter = new MenuPresenter(tripControlsContainer);
const filterPresenter = new FilterPresenter(tripControlsContainer, filterModel);
const statsPresenter = new StatsPresenter(pageBodyContainer, pointsModel);

const handleMenuClick = (menuItem) => {
  switch (menuItem) {
    case MenuItem.TABLE:
      statsPresenter.destroy();
      tripBoardPresenter.showTripBoard();
      tripBoardPresenter.init();
      break;
    case MenuItem.STATS:
      tripBoardPresenter.hideTripBoard();
      tripBoardPresenter.destroy();
      statsPresenter.init();
      break;
  }
};

tripBoardPresenter.init();
tripInfoPresenter.init();
menuPresenter.init();
filterPresenter.init();

menuPresenter.setMenuClickHandler(handleMenuClick);

const handleNewPointFormClose = () => {
  addNewEventButton.disabled = false;
  addNewEventButton.addEventListener(`click`, handleNewPointFormOpen);
};

const handleNewPointFormOpen = (evt) => {
  evt.preventDefault();

  menuPresenter.setActiveMenuItemToDefault();
  filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);

  if (document.querySelector(`.statistics`)) {
    statsPresenter.destroy();
    tripBoardPresenter.showTripBoard();
    tripBoardPresenter.init();
  }

  tripBoardPresenter.createPoint(handleNewPointFormClose);
  addNewEventButton.disabled = true;
  addNewEventButton.removeEventListener(`click`, handleNewPointFormOpen);
};

const addNewEventButton = tripMainContainer.querySelector(`.trip-main__event-add-btn`);
addNewEventButton.addEventListener(`click`, handleNewPointFormOpen);
