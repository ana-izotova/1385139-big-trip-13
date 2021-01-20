import MenuView from "../view/menu.js";
import {remove, render, RenderPosition} from "../utils/render.js";
import {MenuItem, UpdateType} from "../const.js";

class Menu {
  constructor(menuContainer, pointsModel) {
    this._menuContainer = menuContainer;
    this._pointsModel = pointsModel;
    this._pointsCount = null;

    this._menuComponent = null;

    this.setMenuClickHandler = this.setMenuClickHandler.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);

    this._pointsModel.addObserver(this._handleModelEvent);
  }

  init() {
    this._renderMenu();
  }

  setMenuClickHandler(callback) {
    this._menuComponent.setMenuClickHandler(callback);
  }

  setActiveMenuItemToDefault() {
    this._menuComponent.setMenuActiveItem(MenuItem.TABLE);
  }

  _renderMenu() {
    if (this._menuComponent) {
      this._destroy();
    }

    this._menuComponent = new MenuView();
    render(this._menuContainer, this._menuComponent, RenderPosition.AFTERBEGIN);

    this._checkDisable();
  }

  _checkDisable() {
    if (this._pointsCount === 0) {
      this._menuComponent.disableMenuItem(MenuItem.STATS);
    } else {
      this._menuComponent.removeDisable();
    }
  }

  _destroy() {
    remove(this._menuComponent);
    this._menuComponent = null;
  }

  _handleModelEvent(updateType) {
    this._pointsCount = this._pointsModel.getPoints().length;
    if (updateType === UpdateType.INIT) {
      return;
    }

    this._checkDisable();
  }
}

export default Menu;
