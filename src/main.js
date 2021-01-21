import TripBoardPresenter from "./presenter/trip-board.js";
import TripInfoPresenter from "./presenter/info.js";
import FilterPresenter from "./presenter/filter.js";
import MenuPresenter from "./presenter/menu.js";
import StatsPresenter from "./presenter/stats.js";
import PointsModel from "./model/points.js";
import FilterModel from "./model/filter.js";
import Api from "./api/api.js";
import Store from "./api/store.js";
import Provider from "./api/provider.js";
import {MenuItem, UpdateType, FilterType} from "./const.js";
import {isOnline} from "./utils/common.js";
import {toast} from "./utils/toast/toast.js";

const AUTHORIZATION = `Basic thl7xk1e6ng3fp2377`;
const END_POINT = `https://13.ecmascript.pages.academy/big-trip`;
const POINTS_STORE_PREFIX = `big-trip-cache-points`;
const OFFERS_STORE_PREFIX = `big-trip-cache-offers`;
const DESTINATIONS_STORE_PREFIX = `big-trip-cache-destinations`;
const STORE_VER = `v1`;
const POINTS_STORE_NAME = `${POINTS_STORE_PREFIX}-${STORE_VER}`;
const OFFERS_STORE_NAME = `${OFFERS_STORE_PREFIX}-${STORE_VER}`;
const DESTINATIONS_STORE_NAME = `${DESTINATIONS_STORE_PREFIX}-${STORE_VER}`;

const tripMainContainer = document.querySelector(`.trip-main`);
const tripControlsContainer = tripMainContainer.querySelector(`.trip-main__trip-controls`);

const pageMain = document.querySelector(`.page-body__page-main`);
const tripEventsContainer = pageMain.querySelector(`.trip-events`);
const pageBodyContainer = pageMain.querySelector(`.page-body__container`);

const addNewEventButton = tripMainContainer.querySelector(`.trip-main__event-add-btn`);

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

const handleNewPointFormOpen = (evt) => {
  evt.preventDefault();

  if (!isOnline()) {
    toast(`You can't create new point offline`);
    return;
  }

  menuPresenter.setActiveMenuItemToDefault();

  if (filterModel.getFilter() !== FilterType.EVERYTHING) {
    filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
  }

  if (document.querySelector(`.statistics`)) {
    statsPresenter.destroy();
    tripBoardPresenter.showTripBoard();
    tripBoardPresenter.init();
  }

  tripBoardPresenter.createPoint(handleNewPointFormClose);
  addNewEventButton.disabled = true;
  addNewEventButton.removeEventListener(`click`, handleNewPointFormOpen);
};

const handleNewPointFormClose = () => {
  addNewEventButton.disabled = false;
  addNewEventButton.addEventListener(`click`, handleNewPointFormOpen);
};

const api = new Api(END_POINT, AUTHORIZATION);
const pointsStore = new Store(POINTS_STORE_NAME, window.localStorage);
const offersStore = new Store(OFFERS_STORE_NAME, window.localStorage);
const destinationsStore = new Store(DESTINATIONS_STORE_NAME, window.localStorage);

const apiWithProvider = new Provider(api, pointsStore, offersStore, destinationsStore);
const pointsModel = new PointsModel();

const filterModel = new FilterModel();
const tripBoardPresenter = new TripBoardPresenter(tripEventsContainer, pointsModel, filterModel, apiWithProvider);
const tripInfoPresenter = new TripInfoPresenter(tripMainContainer, pointsModel);
const menuPresenter = new MenuPresenter(tripControlsContainer, pointsModel);
const filterPresenter = new FilterPresenter(tripControlsContainer, filterModel, pointsModel);
const statsPresenter = new StatsPresenter(pageBodyContainer, pointsModel);

apiWithProvider.getAllData()
  .then((points) => {
    pointsModel.setPoints(UpdateType.INIT, points);
    menuPresenter.init();
    filterPresenter.init();
    menuPresenter.setMenuClickHandler(handleMenuClick);
  })
  .catch(() => {
    pointsModel.setPoints(UpdateType.INIT, []);
    menuPresenter.init();
    filterPresenter.init();
    menuPresenter.setMenuClickHandler(handleMenuClick);
  });

tripBoardPresenter.init();
tripInfoPresenter.init();

addNewEventButton.addEventListener(`click`, handleNewPointFormOpen);

window.addEventListener(`load`, () => {
  navigator.serviceWorker.register(`/sw.js`);
});

window.addEventListener(`online`, () => {
  document.title = document.title.replace(` [offline]`, ``);
  apiWithProvider.sync();
});

window.addEventListener(`offline`, () => {
  document.title += ` [offline]`;
});

if (!isOnline()) {
  toast(`You are offline`);
}
