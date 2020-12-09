import TripRoutePresenter from "./presenter/trip-route.js";
import TripInfoPresenter from "./presenter/trip-info.js";
import {cards} from "./mock/event-cards.js";

const pageHeader = document.querySelector(`.page-header`);
const tripInfoMainContainer = pageHeader.querySelector(`.trip-main`);

const pageMain = document.querySelector(`.page-body__page-main`);
const tripEventsContainer = pageMain.querySelector(`.trip-events`);

const tripRoutePresenter = new TripRoutePresenter(tripEventsContainer);
const tripInfoPresenter = new TripInfoPresenter(tripInfoMainContainer);

tripRoutePresenter.init(cards);
tripInfoPresenter.init(cards);
