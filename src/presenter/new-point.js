import EditPointView from "../view/edit-point.js";
import {generateId} from "../mock/event-cards.js";
import {remove, render, RenderPosition} from "../utils/render.js";
import {UserAction, UpdateType} from "../const.js";

class NewPoint {
  constructor(tripListContainer, changeData) {
    this._tripListContainer = tripListContainer;
    this._changeData = changeData;

    this._tripEditComponent = null;

    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleCloseFormClick = this._handleCloseFormClick.bind(this);
    this._handleDeleteClick = this._handleDeleteClick.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
  }

  init() {
    if (this._tripEditComponent !== null) {
      return;
    }

    this._tripEditComponent = new EditPointView();
    this._tripEditComponent.setFormSubmitHandler(this._handleFormSubmit);
    this._tripEditComponent.setEditFormCloseHandler(this._handleCloseFormClick);
    this._tripEditComponent.setDeleteClickHandler(this._handleDeleteClick);

    render(this._tripListContainer, this._tripEditComponent, RenderPosition.AFTERBEGIN);
    document.addEventListener(`keydown`, this._escKeyDownHandler);
  }

  destroy() {
    if (this._tripEditComponent === null) {
      return;
    }

    remove(this._tripEditComponent);
    this._tripEditComponent = null;

    document.removeEventListener(`keydown`, this._escKeyDownHandler);
  }

  _handleFormSubmit(point) {
    this._changeData(
        UserAction.ADD_POINT,
        UpdateType.MINOR,
        Object.assign({id: generateId()}, point)
    );
    this.destroy();
  }

  _handleDeleteClick() {
    this.destroy();
  }

  _escKeyDownHandler(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      this.destroy();
    }
  }

  _handleCloseFormClick() {
    this.destroy();
  }
}

export default NewPoint;
