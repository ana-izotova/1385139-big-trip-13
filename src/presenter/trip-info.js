import TripInfoView from "../view/trip-info";
import MenuView from "../view/menu.js";
import FiltersView from "../view/filters.js";
import {render, RenderPosition} from "../utils/render";

class TripInfo {
  constructor(tripInfoMainContainer) {
    this._tripInfoMainContainer = tripInfoMainContainer;
    this._tripControlsContainer = this._tripInfoMainContainer.querySelector(`.trip-main__trip-controls`);

    this._menuComponent = new MenuView();
    this._filtersComponent = new FiltersView();
  }

  init(tripCards) {
    this._tripCards = tripCards;
    if (this._tripCards.length > 0) {
      this._renderTripInfo();
    }
    this._renderTripMenu();
    this._renderTripFilters();
  }

  _renderTripInfo() {
    this._tripInfoComponent = new TripInfoView(this._tripCards);
    render(this._tripInfoMainContainer, this._tripInfoComponent, RenderPosition.AFTERBEGIN);
  }

  _renderTripMenu() {
    render(this._tripControlsContainer, this._menuComponent, RenderPosition.AFTERBEGIN);
  }

  _renderTripFilters() {
    render(this._tripControlsContainer, this._filtersComponent, RenderPosition.BEFOREEND);
  }
}

export default TripInfo;
