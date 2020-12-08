import SortingView from "../view/sorting.js";
import TripListView from "../view/trip-list.js";
import EmptyTripListView from "../view/trip-list-empty.js";
import TripInfoView from "../view/trip-info";
import MenuView from "../view/menu.js";
import FiltersView from "../view/filters.js";
import {render, RenderPosition, replace} from "../utils/render.js";

class TripRoute {
  constructor(tripEventsContainer, tripInfoMainContainer, tripControlsContainer) {
    this._tripEventsContainer = tripEventsContainer;
    this._tripInfoMainContainer = tripInfoMainContainer;
    this._tripControlsContainer = tripControlsContainer;

    this._tripListComponent = new TripListView();
    this._sortingComponent = new SortingView();
    this._emptyTripListComponent = new EmptyTripListView();
    this._menuComponent = new MenuView();
    this._filtersComponent = new FiltersView();
  }

  init(tripCards) {
    this._tripCards = tripCards;
    this._renderTripRoute();
  }

  _renderSort() {
    render(this._tripEventsContainer, this._sortingComponent, RenderPosition.BEFOREEND);
  }

  _renderTripPoint(tripCard) {



  }

  _renderTripPoints() {
    this._tripCards.forEach((tripCard) => this._renderTripPoint(tripCard));
  }

  _renderTripList() {
    render(this._tripEventsContainer, this._tripListComponent, RenderPosition.BEFOREEND);
  }

  _renderTripInfo() {
    this._tripInfoComponent = new TripInfoView(this._tripCards);
    render(this._tripInfoMainContainer, this._tripInfoComponent, RenderPosition.AFTERBEGIN);
  }

  _renderTripMenu() {
    render(this._tripControlsContainer, this._menuComponent, RenderPosition.AFTERBEGIN);
  }

  _renderTripFilters() {
    render(this._tripControlsContainer, this._filtersComponent, RenderPosition.BEFOREEND);
  }

  _renderEmptyTripList() {
    render(this._tripEventsContainer, this._emptyTripListComponent, RenderPosition.BEFOREEND);
  }

  _renderTripRoute() {
    this._renderTripMenu();
    this._renderTripFilters();
    this._renderSort();
    this._renderTripList();
    if (this._tripCards.length === 0) {
      this._renderEmptyTripList();
    } else {
      this._renderTripInfo();
      this._renderTripPoints();
    }
  }
}

export default TripRoute;
