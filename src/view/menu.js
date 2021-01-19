import AbstractView from "./abstract.js";
import {MenuItem} from "../const.js";

const createMenuTemplate = () => {
  return `<div><h2 class="visually-hidden">Switch trip view</h2>
          <nav class="trip-controls__trip-tabs  trip-tabs">
            <a class="trip-tabs__btn trip-tabs__btn--active" href="#" data-menu-item="${MenuItem.TABLE}">Table</a>
             <a class="trip-tabs__btn" href="#" data-menu-item="${MenuItem.STATS}">Stats</a>
          </nav></div>`;
};

class Menu extends AbstractView {
  constructor() {
    super();

    this._menuClickHandler = this._menuClickHandler.bind(this);
  }

  getTemplate() {
    return createMenuTemplate();
  }

  setMenuActiveItem(menuItem) {
    this.getElement()
      .querySelectorAll(`.trip-tabs__btn`)
      .forEach((item) => item.classList.remove(`trip-tabs__btn--active`));

    const activeMenuItem = this.getElement().querySelector(`[data-menu-item="${menuItem}"]`);
    activeMenuItem.classList.add(`trip-tabs__btn--active`);
  }

  setMenuClickHandler(callback) {
    this._callback.menuClick = callback;
    const menuTabs = this.getElement().querySelectorAll(`.trip-tabs__btn`);
    menuTabs.forEach((tab) => tab.addEventListener(`click`, this._menuClickHandler));
  }

  _menuClickHandler(evt) {
    if (evt.target.classList.contains(`trip-tabs__btn--active`)) {
      return;
    }
    evt.preventDefault();
    this._callback.menuClick(evt.target.dataset.menuItem);
    this.setMenuActiveItem(evt.target.dataset.menuItem);
  }
}

export default Menu;
