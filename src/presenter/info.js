import TripInfoView from "../view/trip-info";
import {render, RenderPosition} from "../utils/render";

class Info {
  constructor(tripInfoMainContainer) {
    this._tripInfoMainContainer = tripInfoMainContainer;
  }

  init(tripCards) {
    this._tripCards = tripCards;
    if (this._tripCards.length > 0) {
      this._renderTripInfo();
    }
  }

  _renderTripInfo() {
    this._tripInfoComponent = new TripInfoView(this._tripCards);
    render(this._tripInfoMainContainer, this._tripInfoComponent, RenderPosition.AFTERBEGIN);
  }
}

export default Info;
