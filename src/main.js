import TripBoardPresenter from "./presenter/trip.js";
import TripInfoPresenter from "./presenter/info.js";
import MenuView from "./view/menu.js";
import FiltersView from "./view/filters.js";
import {render, RenderPosition} from "./utils/render.js";
import {cards} from "./mock/event-cards.js";

const pageHeader = document.querySelector(`.page-header`);
const tripInfoMainContainer = pageHeader.querySelector(`.trip-main`);
const tripControlsContainer = tripInfoMainContainer.querySelector(`.trip-main__trip-controls`);

const pageMain = document.querySelector(`.page-body__page-main`);
const tripEventsContainer = pageMain.querySelector(`.trip-events`);

const tripBoardPresenter = new TripBoardPresenter(tripEventsContainer);
const tripInfoPresenter = new TripInfoPresenter(tripInfoMainContainer);

render(tripControlsContainer, new MenuView(), RenderPosition.AFTERBEGIN);
render(tripControlsContainer, new FiltersView(), RenderPosition.BEFOREEND);
tripInfoPresenter.init(cards);
tripBoardPresenter.init(cards);
