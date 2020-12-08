import TripRoutePresenter from "./presenter/tripRoute.js";
import {cards} from "./mock/event-cards.js";

const pageHeader = document.querySelector(`.page-header`);
const tripInfoMainContainer = pageHeader.querySelector(`.trip-main`);
const tripControlsContainer = tripInfoMainContainer.querySelector(`.trip-main__trip-controls`);

const pageMain = document.querySelector(`.page-body__page-main`);
const tripEventsContainer = pageMain.querySelector(`.trip-events`);

const tripRoutePresenter = new TripRoutePresenter(tripEventsContainer, tripInfoMainContainer, tripControlsContainer);
tripRoutePresenter.init(cards);
