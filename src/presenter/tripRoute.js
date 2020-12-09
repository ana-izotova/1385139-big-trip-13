import SortingView from "../view/sorting.js";
import TripListView from "../view/trip-list.js";
import EmptyTripListView from "../view/trip-list-empty.js";
import TripInfoView from "../view/trip-info";
import MenuView from "../view/menu.js";
import FiltersView from "../view/filters.js";
import TripPointPresenter from "./tripPoint.js";
import {render, RenderPosition} from "../utils/render.js";
import {updateItem} from "../utils/common.js";

class TripRoute {
  constructor(tripEventsContainer, tripInfoMainContainer, tripControlsContainer) {
    this._tripEventsContainer = tripEventsContainer;
    this._tripInfoMainContainer = tripInfoMainContainer;
    this._tripControlsContainer = tripControlsContainer;

    this._tripPresenter = {};

    this._tripListComponent = new TripListView();
    this._sortingComponent = new SortingView();
    this._emptyTripListComponent = new EmptyTripListView();
    this._menuComponent = new MenuView();
    this._filtersComponent = new FiltersView();

    this._handleTripChange = this._handleTripChange.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
  }

  init(tripCards) {
    this._tripCards = tripCards;
    this._renderTripRoute();
  }

  _renderSort() {
    render(this._tripEventsContainer, this._sortingComponent, RenderPosition.BEFOREEND);
  }

  _renderTripPoint(tripCard) {
    const tripPresenter = new TripPointPresenter(this._tripListComponent, this._handleTripChange, this._handleModeChange);
    tripPresenter.init(tripCard);
    this._tripPresenter[tripCard.id] = tripPresenter;
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

  _handleTripChange(updatedTrip) {
    this._tripCards = updateItem(this._tripCards, updatedTrip);
    this._tripPresenter[updatedTrip.id].init(updatedTrip);
  }

  _handleModeChange() {
    Object
      .values(this._tripPresenter)
      .forEach((presenter) => presenter.resetView());
  }

  _clearTripList() {
    Object
      .values(this._tripPresenter)
      .forEach((presenter) => presenter.destroy());
    this._tripPresenter = {};
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
