import StatsView from "../view/stats.js";
import {render, remove, RenderPosition} from "../utils/render";

class Stats {
  constructor(statsContainer, pointsModel) {
    this._statsContainer = statsContainer;
    this._pointsModel = pointsModel;

    this._statsComponent = null;

    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._pointsModel.addObserver(this._handleModelEvent);
  }

  init() {
    this._renderStats();
  }

  destroy() {
    if (this._statsComponent) {
      remove(this._statsComponent);
      this._statsComponent = null;
    }
  }

  _handleModelEvent() {
    this.destroy();
    this.init();
  }

  _renderStats() {
    const tripPoints = this._pointsModel.getPoints();
    this._statsComponent = new StatsView(tripPoints);
    render(this._statsContainer, this._statsComponent, RenderPosition.BEFOREEND);
  }
}

export default Stats;
