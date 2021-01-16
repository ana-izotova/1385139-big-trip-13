import TripInfoView from "../view/trip-info";
import {remove, render, RenderPosition} from "../utils/render.js";
import {defaultSortPointsByDate} from "../utils/trip.js";
import {UpdateType} from "../const";

class Info {
  constructor(tripInfoMainContainer, pointsModel) {
    this._tripInfoMainContainer = tripInfoMainContainer;
    this._pointsModel = pointsModel;

    this._tripInfoComponent = null;

    this._handleModelEvent = this._handleModelEvent.bind(this);

    this._pointsModel.addObserver(this._handleModelEvent);
  }

  init() {
    const points = this._getSortedPoints();
    if (points.length > 0) {
      this._renderTripInfo();
    }
  }

  _getSortedPoints() {
    const points = this._pointsModel.getPoints();
    return points.sort(defaultSortPointsByDate);
  }

  _handleModelEvent(updateType) {
    switch (updateType) {
      case UpdateType.INIT:
        this.init();
        break;
      default:
        this._destroy();
        this.init();
        break;
    }
  }

  _destroy() {
    remove(this._tripInfoComponent);
    this._tripInfoComponent = null;
  }

  _renderTripInfo() {
    const points = this._getSortedPoints();
    this._tripInfoComponent = new TripInfoView(points);
    render(this._tripInfoMainContainer, this._tripInfoComponent, RenderPosition.AFTERBEGIN);
  }
}

export default Info;
