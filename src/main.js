import {render, RenderPosition} from "./view/utils.js";
import TripInfoView from "./view/trip-info.js";
import MenuView from "./view/menu.js";
import FiltersView from "./view/filters.js";
import SortingView from "./view/sorting.js";
import TripListView from "./view/trip-list.js";
import TripPointView from "./view/trip-point.js";
import EditPointView from "./view/edit-point.js";
import TripListEmptyView from "./view/trip-list-empty.js";
import {cards} from "./mock/event-cards.js";

const pageHeader = document.querySelector(`.page-header`);
const tripMainElement = pageHeader.querySelector(`.trip-main`);
const tripControlsElement = tripMainElement.querySelector(`.trip-main__trip-controls`);
const pageMain = document.querySelector(`.page-body__page-main`);
const tripEventsSection = pageMain.querySelector(`.trip-events`);

const renderTripPoint = (tripListElement, tripCard) => {
  const tripComponent = new TripPointView(tripCard);
  const editTripComponent = new EditPointView(tripCard);

  const replaceTripToForm = () => {
    tripListElement.replaceChild(editTripComponent.getElement(), tripComponent.getElement());
  };

  const replaceFormToCard = () => {
    tripListElement.replaceChild(tripComponent.getElement(), editTripComponent.getElement());
  };

  tripComponent.setEditClickHandler(() => {
    if (!tripListElement.querySelector(`form`)) {
      replaceTripToForm();
      document.addEventListener(`keydown`, onEscKeyDown);
    }
  });

  editTripComponent.setFormSubmitHandler(() => {
    replaceFormToCard();
    document.removeEventListener(`keydown`, onEscKeyDown);
  });

  editTripComponent.setEditFormCloseHandler(() => {
    replaceFormToCard();
    document.removeEventListener(`keydown`, onEscKeyDown);
  });

  const onEscKeyDown = (evt) => {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      replaceFormToCard();
      document.removeEventListener(`keydown`, onEscKeyDown);
    }
  };

  render(tripListElement, tripComponent.getElement(), RenderPosition.BEFOREEND);
};

const renderTripRouteBoard = (tripCards) => {
  render(tripControlsElement, new MenuView().getElement(), RenderPosition.AFTERBEGIN);
  render(tripControlsElement, new FiltersView().getElement(), RenderPosition.BEFOREEND);
  render(tripEventsSection, new SortingView().getElement(), RenderPosition.BEFOREEND);

  const tripListComponent = new TripListView();
  render(tripEventsSection, tripListComponent.getElement(), RenderPosition.BEFOREEND);

  if (cards.length === 0) {
    render(tripEventsSection, new TripListEmptyView().getElement(), RenderPosition.BEFOREEND);
  } else {
    render(tripMainElement, new TripInfoView(cards).getElement(), RenderPosition.AFTERBEGIN);
    tripCards.forEach((card) => {
      renderTripPoint(tripListComponent.getElement(), card);
    });
  }
};

renderTripRouteBoard(cards);
