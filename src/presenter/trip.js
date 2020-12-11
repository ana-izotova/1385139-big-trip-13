import SortTripView from "../view/sort.js";
import TripListView from "../view/trip-list.js";
import EmptyTripListView from "../view/trip-list-empty.js";
import TripPointPresenter from "./point.js";
import {render, RenderPosition} from "../utils/render.js";
import {updateItem} from "../utils/common.js";
import {sortTripCardsByPrice, sortTripCardsByDuration} from "../utils/trip.js";
import {SortType} from "../view/sort.js";

class Trip {
  constructor(tripEventsContainer) {
    this._tripEventsContainer = tripEventsContainer;

    this._tripPresenter = {};
    this._currentSortType = SortType.DEFAULT;

    this._tripListComponent = new TripListView();
    this._sortingComponent = new SortTripView();
    this._emptyTripListComponent = new EmptyTripListView();

    this._handleTripChange = this._handleTripChange.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
  }

  init(tripCards) {
    this._tripCards = tripCards.slice();
    this._sourcedCards = tripCards.slice();
    this._renderTrip();
  }

  _sortTripCards(sortType) {
    switch (sortType) {
      case SortType.PRICE:
        this._tripCards.sort(sortTripCardsByPrice);
        break;
      case SortType.TIME:
        this._tripCards.sort(sortTripCardsByDuration);
        break;
      default:
        this._tripCards = this._sourcedCards.slice();
    }

    this._currentSortType = sortType;

    const currentLabel = this._sortingComponent
      .getElement()
      .querySelector(`label[data-sort-type=${this._currentSortType}]`);
    this._sortingComponent
      .getElement()
      .querySelector(`input[id=${currentLabel.htmlFor}]`)
      .setAttribute(`checked`, `true`);
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._sortTripCards(sortType);
    this._clearTripList();
    this._renderTripList();
  }

  _renderSort() {
    render(this._tripEventsContainer, this._sortingComponent, RenderPosition.BEFOREEND);
    this._sortingComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
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
    if (this._tripCards.length === 0) {
      this._renderEmptyTripList();
    } else {
      this._renderTripPoints();
    }
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

  _renderTrip() {
    this._renderSort();
    this._renderTripList();
  }
}

export default Trip;
