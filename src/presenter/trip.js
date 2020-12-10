import SortingView from "../view/sorting.js";
import TripListView from "../view/trip-list.js";
import EmptyTripListView from "../view/trip-list-empty.js";
import TripPointPresenter from "./point.js";
import {render, RenderPosition} from "../utils/render.js";
import {updateItem} from "../utils/common.js";

class Trip {
  constructor(tripEventsContainer) {
    this._tripEventsContainer = tripEventsContainer;

    this._tripPresenter = {};

    this._tripListComponent = new TripListView();
    this._sortingComponent = new SortingView();
    this._emptyTripListComponent = new EmptyTripListView();

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
    this._renderSort();
    this._renderTripList();
    if (this._tripCards.length === 0) {
      this._renderEmptyTripList();
    } else {
      this._renderTripPoints();
    }
  }
}

export default Trip;
