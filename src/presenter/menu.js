import MenuView from "../view/menu.js";
import {render, RenderPosition} from "../utils/render.js";
import {MenuItem} from "../const";

class Menu {
  constructor(menuContainer, pointsModel, filterModel) {
    this._menuContainer = menuContainer;
    this._pointsModel = pointsModel;
    this._filterModel = filterModel;

    this._menuComponent = null;

    this.setMenuClickHandler = this.setMenuClickHandler.bind(this);
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
    this._menuComponent = new MenuView();
    render(this._menuContainer, this._menuComponent, RenderPosition.AFTERBEGIN);
  }
}

export default Menu;
