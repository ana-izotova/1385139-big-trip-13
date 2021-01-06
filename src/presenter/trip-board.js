import SortTripView from "../view/sort.js";
import TripListView from "../view/trip-list.js";
import EmptyTripListView from "../view/trip-list-empty.js";
import TripPointPresenter from "./point.js";
import NewPointPresenter from "./new-point.js";
import {render, remove, RenderPosition} from "../utils/render.js";
import {sortTripCardsByPrice, sortTripCardsByDuration} from "../utils/trip.js";
import {SortType, UpdateType, UserAction, FilterType} from "../const.js";
import {filter} from "../utils/filter";

class TripBoard {
  constructor(pointsContainer, pointsModel, filterModel) {
    this._pointsModel = pointsModel;
    this._filterModel = filterModel;
    this._tripPointsContainer = pointsContainer;

    this._tripPresenter = {};
    this._currentSortType = SortType.DEFAULT;

    this._sortingComponent = null;
    this._tripListComponent = new TripListView();
    this._emptyTripListComponent = new EmptyTripListView();

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);

    this._pointsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);

    this._newPointPresenter = new NewPointPresenter(this._tripListComponent, this._handleViewAction);
  }

  init() {
    this._renderTripBoard();
  }

  createPoint() {
    this._currentSortType = SortType.DEFAULT;
    this._filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this._newPointPresenter.init();
  }

  _getPoints() {
    const filterType = this._filterModel.getFilter();
    const points = this._pointsModel.getPoints();
    const filteredPoints = filter[filterType](points);

    switch (this._currentSortType) {
      case SortType.PRICE:
        return filteredPoints.sort(sortTripCardsByPrice);
      case SortType.TIME:
        return filteredPoints.sort(sortTripCardsByDuration);
    }

    return filteredPoints;
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._currentSortType = sortType;
    this._clearTripBoard();
    this._renderTripBoard();
  }

  _renderSort() {
    if (this._sortingComponent !== null) {
      this._sortingComponent = null;
    }

    this._sortingComponent = new SortTripView(this._currentSortType);
    this._sortingComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
    render(this._tripPointsContainer, this._sortingComponent, RenderPosition.BEFOREEND);
  }

  _renderTripPoint(point) {
    const tripPresenter = new TripPointPresenter(this._tripListComponent, this._handleViewAction, this._handleModeChange);
    tripPresenter.init(point);
    this._tripPresenter[point.id] = tripPresenter;
  }

  _renderTripPoints(points) {
    points.forEach((point) => this._renderTripPoint(point));
  }

  _renderTripList() {
    render(this._tripPointsContainer, this._tripListComponent, RenderPosition.BEFOREEND);
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
        this._clearTripBoard();
        this._renderTripBoard();
        break;
      case UpdateType.MAJOR:
        this._clearTripBoard({resetSortType: true});
        this._renderTripBoard();
        break;
    }
  }

  _handleModeChange() {
    this._newPointPresenter.destroy();
    Object
      .values(this._tripPresenter)
      .forEach((presenter) => presenter.resetView());
  }

  _clearTripBoard({resetSortType = false} = {}) {
    this._newPointPresenter.destroy();
    Object
      .values(this._tripPresenter)
      .forEach((presenter) => presenter.destroy());
    this._tripPresenter = {};

    remove(this._sortingComponent);
    remove(this._emptyTripListComponent);

    if (resetSortType) {
      this._currentSortType = SortType.DEFAULT;
    }
  }

  _renderTripBoard() {
    const points = this._getPoints();
    const pointsAmount = points.length;

    if (pointsAmount === 0) {
      this._renderEmptyTripList();
      return;
    }

    this._renderSort();
    this._renderTripList();
    this._renderTripPoints(points);
  }
}

export default TripBoard;
