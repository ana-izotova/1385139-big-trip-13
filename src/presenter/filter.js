import FilterView from "../view/filter.js";
import {render, RenderPosition, replace, remove} from "../utils/render.js";
import {FilterType, UpdateType} from "../const.js";
import {filter} from "../utils/filter.js";

class Filter {
  constructor(filterContainer, filterModel, pointsModel) {
    this._filterContainer = filterContainer;
    this._filterModel = filterModel;
    this._pointsModel = pointsModel;
    this._currentFilter = null;

    this._filterComponent = null;

    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleFilterTypeChange = this._handleFilterTypeChange.bind(this);

    this._filterModel.addObserver(this._handleModelEvent);
    this._pointsModel.addObserver(this._handleModelEvent);
  }

  init() {
    this._currentFilter = this._filterModel.getFilter();

    const filters = this._getFilters();
    const prevFilterComponent = this._filterComponent;

    this._filterComponent = new FilterView(filters, this._currentFilter);
    this._filterComponent.setFilterTypeChangeHandler(this._handleFilterTypeChange);

    if (prevFilterComponent === null) {
      render(this._filterContainer, this._filterComponent, RenderPosition.BEFOREEND);
      return;
    }

    replace(this._filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  }

  _getFilters() {
    const points = this._pointsModel.getPoints();

    return [
      {
        type: `everything`,
        name: `Everything`,
        amount: filter[FilterType.EVERYTHING](points).length
      },
      {
        type: `future`,
        name: `Future`,
        amount: filter[FilterType.FUTURE](points).length
      },
      {
        type: `past`,
        name: `Past`,
        amount: filter[FilterType.PAST](points).length
      }
    ];
  }

  _handleModelEvent() {
    this.init();
  }

  _handleFilterTypeChange(filterType) {
    if (this._currentFilter === filterType) {
      return;
    }

    this._filterModel.setFilter(UpdateType.MAJOR, filterType);
  }
}

export default Filter;
