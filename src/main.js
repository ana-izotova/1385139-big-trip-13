import TripBoardPresenter from "./presenter/trip-board.js";
import TripInfoPresenter from "./presenter/info.js";
import FilterPresenter from "./presenter/filter.js";
import MenuPresenter from "./presenter/menu.js";
import PointsModel from "./model/points.js";
import FilterModel from "./model/filter.js";
import DestinationsModel from "./model/destinations.js";
import OffersModel from "./model/offers.js";
import StatsPresenter from "./presenter/stats.js";
import {MenuItem, UpdateType, FilterType} from "./const.js";
import Api from "./api.js";

const AUTHORIZATION = `Basic thl7xk1e6ng3fpr`;
const END_POINT = `https://13.ecmascript.pages.academy/big-trip`;

const tripMainContainer = document.querySelector(`.trip-main`);
const tripControlsContainer = tripMainContainer.querySelector(`.trip-main__trip-controls`);

const pageMain = document.querySelector(`.page-body__page-main`);
const tripEventsContainer = pageMain.querySelector(`.trip-events`);
const pageBodyContainer = pageMain.querySelector(`.page-body__container`);

const api = new Api(END_POINT, AUTHORIZATION);

const pointsModel = new PointsModel();
const filterModel = new FilterModel();
const destinationsModel = new DestinationsModel();
const offersModel = new OffersModel();

const tripBoardPresenter = new TripBoardPresenter(tripEventsContainer, pointsModel, filterModel, offersModel, destinationsModel, api);
const tripInfoPresenter = new TripInfoPresenter(tripMainContainer, pointsModel);
const menuPresenter = new MenuPresenter(tripControlsContainer);
const filterPresenter = new FilterPresenter(tripControlsContainer, filterModel);
const statsPresenter = new StatsPresenter(pageBodyContainer, pointsModel);

Promise
  .all([
    api.getPoints(),
    api.getDestinations(),
    api.getOffers()
  ])
  .then(([points, destinations, offers]) => {
    destinationsModel.setDestinations(destinations);
    offersModel.setOffers(offers);
    pointsModel.setPoints(UpdateType.INIT, points);
    menuPresenter.init();
    filterPresenter.init();
    menuPresenter.setMenuClickHandler(handleMenuClick);

  })
  .catch((err) => {
    console.log(err)
    pointsModel.setPoints(UpdateType.INIT, []);
    menuPresenter.init();
    filterPresenter.init();
    menuPresenter.setMenuClickHandler(handleMenuClick);

  });


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
