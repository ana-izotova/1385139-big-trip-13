import SortTripView from "../view/sort.js";
import TripListView from "../view/trip-list.js";
import EmptyTripListView from "../view/trip-list-empty.js";
import LoadingView from "../view/loading.js";
import TripPointPresenter, {State as TripPointPresenterViewState} from "./point.js";
import NewPointPresenter from "./new-point.js";
import {render, remove, RenderPosition} from "../utils/render.js";
import {defaultSortPointsByDate, sortPointsByPrice, sortPointsByDuration} from "../utils/trip.js";
import {SortType, UpdateType, UserAction} from "../const.js";
import {filter} from "../utils/filter";

class TripBoard {
  constructor(pointsContainer, pointsModel, filterModel, offersModel, destinationsModel, api) {
    this._pointsModel = pointsModel;
    this._filterModel = filterModel;
    this._offersModel = offersModel;
    this._destinationsModel = destinationsModel;
    this._tripPointsContainer = pointsContainer;
    this._api = api;

    this._tripPresenter = {};
    this._currentSortType = SortType.DEFAULT;
    this._isLoading = true;

    this._sortingComponent = null;
    this._tripListComponent = new TripListView();
    this._emptyTripListComponent = new EmptyTripListView();
    this._loadingComponent = new LoadingView();

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);

    this._newPointPresenter = new NewPointPresenter(this._tripListComponent, this._handleViewAction, offersModel, destinationsModel);

    this._pointsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
  }

  init() {
    this._renderTripBoard();
  }

  destroy() {
    this._clearTripBoard({resetSortType: true});

    remove(this._tripListComponent);
  }

  createPoint(callback) {
    this._newPointPresenter.init(callback);
  }

  hideTripBoard() {
    this._tripPointsContainer.classList.add(`trip-events--hidden`);
  }

  showTripBoard() {
    this._tripPointsContainer.classList.remove(`trip-events--hidden`);
  }

  _getPoints() {
    const filterType = this._filterModel.getFilter();
    const points = this._pointsModel.getPoints();
    const filteredPoints = filter[filterType](points);

    switch (this._currentSortType) {
      case SortType.PRICE:
        return filteredPoints.sort(sortPointsByPrice);
      case SortType.TIME:
        return filteredPoints.sort(sortPointsByDuration);
      default:
        return filteredPoints.sort(defaultSortPointsByDate);
    }
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
    const tripPresenter = new TripPointPresenter(
        this._tripListComponent, this._handleViewAction,
        this._handleModeChange, this._offersModel, this._destinationsModel);
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

  _renderLoading() {
    render(this._tripPointsContainer, this._loadingComponent, RenderPosition.BEFOREEND);
  }

  _handleViewAction(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this._tripPresenter[update.id].setViewState(TripPointPresenterViewState.SAVING);
        this._api.updatePoint(update)
          .then((response) => {
            this._pointsModel.updatePoint(updateType, response);
          })
          .catch(() => {
            this._tripPresenter[update.id].setViewState(TripPointPresenterViewState.ABORTING);
          });
        break;
      case UserAction.ADD_POINT:
        this._newPointPresenter.setSaving();
        this._api.addPoint(update)
          .then((response) => {
            this._pointsModel.addPoint(updateType, response);
          })
          .catch(() => {
            this._newPointPresenter.setAborting();
          });
        break;
      case UserAction.DELETE_POINT:
        this._tripPresenter[update.id].setViewState(TripPointPresenterViewState.DELETING);
        this._api.deletePoint(update)
          .then(() => {
            this._pointsModel.deletePoint(updateType, update);
          })
          .catch(() => {
            this._tripPresenter[update.id].setViewState(TripPointPresenterViewState.ABORTING);
          });
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
      case UpdateType.INIT:
        this._isLoading = false;
        remove(this._loadingComponent);
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
    remove(this._loadingComponent);

    if (resetSortType) {
      this._currentSortType = SortType.DEFAULT;
    }
  }

  _renderTripBoard() {
    if (this._isLoading) {
      this._renderLoading();
      return;
    }

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
