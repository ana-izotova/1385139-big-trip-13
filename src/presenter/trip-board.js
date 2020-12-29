import SortTripView from "../view/sort.js";
import TripListView from "../view/trip-list.js";
import EmptyTripListView from "../view/trip-list-empty.js";
import TripPointPresenter from "./point.js";
import {render, RenderPosition} from "../utils/render.js";
import {sortTripCardsByPrice, sortTripCardsByDuration} from "../utils/trip.js";
import {SortType, UpdateType, UserAction} from "../const.js";

class TripBoard {
  constructor(pointsContainer, pointsModel) {
    this._pointsModel = pointsModel;
    this._tripPointsContainer = pointsContainer;

    this._tripPresenter = {};
    this._currentSortType = SortType.DEFAULT;

    this._tripListComponent = new TripListView();
    this._sortingComponent = new SortTripView();
    this._emptyTripListComponent = new EmptyTripListView();

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);

    this._pointsModel.addObserver(this._handleModelEvent);
  }

  init() {
    this._renderTripBoard();
  }

  _getPoints() {
    switch (this._currentSortType) {
      case SortType.PRICE:
        return this._pointsModel.getPoints().slice().sort(sortTripCardsByPrice);
      case SortType.TIME:
        return this._pointsModel.getPoints().slice().sort(sortTripCardsByDuration);
    }

    return this._pointsModel.getPoints();
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._currentSortType = sortType;
    this._clearTripList();
    this._renderTripList(this._getPoints());
  }

  _renderSort() {
    render(this._tripPointsContainer, this._sortingComponent, RenderPosition.BEFOREEND);
    this._sortingComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
  }

  _renderTripPoint(point) {
    const tripPresenter = new TripPointPresenter(this._tripListComponent, this._handleViewAction, this._handleModeChange);
    tripPresenter.init(point);
    this._tripPresenter[point.id] = tripPresenter;
  }

  _renderTripPoints(points) {
    points.forEach((point) => this._renderTripPoint(point));
  }

  _renderTripList(points) {
    render(this._tripPointsContainer, this._tripListComponent, RenderPosition.BEFOREEND);
    if (points.length === 0) {
      this._renderEmptyTripList();
    } else {
      this._renderTripPoints(points);
    }
  }

  _renderEmptyTripList() {
    render(this._tripPointsContainer, this._emptyTripListComponent, RenderPosition.BEFOREEND);
  }

  _handleViewAction(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this._pointsModel.updatePoint(updateType, update);
        break;
      case UserAction.ADD_POINT:
        this._pointsModel.addPoint(updateType, update);
        break;
      case UserAction.DELETE_POINT:
        this._pointsModel.deletePoint(updateType, update);
        break;
    }
  }

  _handleModelEvent(updateType, data) {
    switch (updateType) {
      case UpdateType.PATCH:
        this._tripPresenter[data.id].init(data);
        break;
      case UpdateType.MINOR:
        //
        break;
      case UpdateType.MAJOR:
        //
        break;
    }
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

  _renderTripBoard() {
    this._renderSort();
    this._renderTripList(this._getPoints());
  }
}

export default TripBoard;
