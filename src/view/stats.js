import AbstractView from "./abstract.js";
import {BAR_HEIGHT} from "../const.js";
import {renderMoneyChart, renderTypeChart, renderTimeChart} from "../utils/stats.js";

const createStatsTemplate = () => {
  return `<section class="statistics">
          <h2 class="visually-hidden">Trip statistics</h2>

          <div class="statistics__item statistics__item--money">
            <canvas class="statistics__chart  statistics__chart--money" width="900"></canvas>
          </div>

          <div class="statistics__item statistics__item--transport">
            <canvas class="statistics__chart  statistics__chart--transport" width="900"></canvas>
          </div>

          <div class="statistics__item statistics__item--time-spend">
            <canvas class="statistics__chart  statistics__chart--time" width="900"></canvas>
          </div>
        </section>`;
};

class Stats extends AbstractView {
  constructor(points) {
    super();

    this._data = points;

    this._moneyChart = null;
    this._typeChart = null;
    this._timeChart = null;

    this._setCharts();
  }

  getTemplate() {
    return createStatsTemplate(this._data);
  }

  removeElement() {
    super.removeElement();

    this._removeCharts();
  }

  restoreHandlers() {
    this._setCharts();
  }

  _setCharts() {
    const moneyCtx = this.getElement().querySelector(`.statistics__chart--money`);
    const typeCtx = this.getElement().querySelector(`.statistics__chart--transport`);
    const timeCtx = this.getElement().querySelector(`.statistics__chart--time`);

    const types = [];
    this._data.forEach((point) => types.push(point.type.toUpperCase()));
    const labels = [...new Set(types)];
    const chartItemsLength = labels.length;

    moneyCtx.height = BAR_HEIGHT * chartItemsLength;
    typeCtx.height = BAR_HEIGHT * chartItemsLength;
    timeCtx.height = BAR_HEIGHT * chartItemsLength;

    this._moneyChart = renderMoneyChart(moneyCtx, this._data, labels);
    this._typeChart = renderTypeChart(typeCtx, this._data, labels);
    this._timeChart = renderTimeChart(timeCtx, this._data, labels);
  }

  _removeCharts() {
    if ([this._moneyChart, this._typeChart, this._timeChart].includes(null)) {
      this._moneyChart = null;
      this._typeChart = null;
      this._timeChart = null;
    }
  }
}

export default Stats;
