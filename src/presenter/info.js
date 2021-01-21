import TripInfoView from "../view/trip-info.js";
import {remove, render, RenderPosition} from "../utils/render.js";
import {defaultSortPointsByDate} from "../utils/trip.js";

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

  _handleModelEvent() {
    if (!this._tripInfoComponent) {
      this.init();
      return;
    }

    this._destroy();
    this.init();
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
