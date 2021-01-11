import AbstractView from "./abstract.js";
import {MenuItem} from "../const.js";

const createTripMainTemplate = () => {
  return `<div class="trip-main">
          <!-- Маршрут и стоимость -->

          <div class="trip-main__trip-controls  trip-controls">
            <!-- Меню -->
          <div><h2 class="visually-hidden">Switch trip view</h2>
            <nav class="trip-controls__trip-tabs  trip-tabs">
             <a class="trip-tabs__btn" href="#" data-menu-item="${MenuItem.TABLE}">Table</a>
             <a class="trip-tabs__btn trip-tabs__btn--active" href="#" data-menu-item="${MenuItem.STATS}">Stats</a>
            </nav>
          </div>
            <!-- Фильтры -->
          </div>

          <button class="trip-main__event-add-btn  btn  btn--big  btn--yellow" type="button" data-menu-item="${MenuItem.ADD_NEW_POINT}">New event</button>
        </div>`;
};

class TripMain extends AbstractView {
  constructor() {
    super();

    this._menuClickHandler = this._menuClickHandler.bind(this);
  }

  getTemplate() {
    return createTripMainTemplate();
  }

  _menuClickHandler(evt) {
    evt.preventDefault();
    // console.log(evt.target.dataset.menuItem)
    this._callback.menuClick(evt.target.dataset.menuItem);
  }

  setMenuClickHandler(callback) {
    this._callback.menuClick = callback;
    const menuTabs = this.getElement().querySelectorAll(`.trip-tabs__btn`);
    menuTabs.forEach((tab) => tab.addEventListener(`click`, this._menuClickHandler));
    const addNewEventButton = this.getElement().querySelector(`.trip-main__event-add-btn`);
    addNewEventButton.addEventListener(`click`, this._menuClickHandler);
  }

  setMenuItem(menuItem) {
    const item = this.getElement().querySelector(`[data-menu-item="${menuItem}"]`);
    console.log(menuItem)

    if (item !== null) {
      item.classList.add(`trip-tabs__btn--active`);
    }
  }
}

export default TripMain;
