import TripBoardPresenter from "./presenter/trip-board.js";
import TripInfoPresenter from "./presenter/info.js";
import FilterPresenter from "./presenter/filter.js";
import PointsModel from "./model/points.js";
import FilterModel from "./model/filter.js";
import MenuView from "./view/menu.js";
import {render, RenderPosition} from "./utils/render.js";
import {cards} from "./mock/event-cards.js";

const pointsModel = new PointsModel();
pointsModel.setPoints(cards);

const filterModel = new FilterModel();

const pageHeader = document.querySelector(`.page-header`);
const tripInfoMainContainer = pageHeader.querySelector(`.trip-main`);
const tripControlsContainer = tripInfoMainContainer.querySelector(`.trip-main__trip-controls`);

const pageMain = document.querySelector(`.page-body__page-main`);
const tripEventsContainer = pageMain.querySelector(`.trip-events`);

const tripBoardPresenter = new TripBoardPresenter(tripEventsContainer, pointsModel, filterModel);
const tripInfoPresenter = new TripInfoPresenter(tripInfoMainContainer, pointsModel);
const filterPresenter = new FilterPresenter(tripControlsContainer, filterModel);

render(tripControlsContainer, new MenuView(), RenderPosition.AFTERBEGIN);

tripBoardPresenter.init();
tripInfoPresenter.init();
filterPresenter.init();

const addNewEventButtton = tripInfoMainContainer.querySelector(`.trip-main__event-add-btn`);
addNewEventButtton.addEventListener(`click`, (evt) => {
  evt.preventDefault();
  tripBoardPresenter.createPoint();
});
