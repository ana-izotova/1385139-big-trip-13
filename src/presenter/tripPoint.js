import TripPointView from "../view/trip-point.js";
import EditPointView from "../view/edit-point.js";
import {remove, render, RenderPosition, replace} from "../utils/render.js";

class TripPoint {
  constructor(tripListContainer) {
    this._tripListContainer = tripListContainer;

    this._tripComponent = null;
    this._tripEditComponent = null;

    this._handleEditClick = this._handleEditClick.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleCloseFormClick = this._handleCloseFormClick.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
  }

  init(tripCard) {
    this._tripCard = tripCard;

    const prevTripComponent = this._tripComponent;
    const prevTripEditComponent = this._tripEditComponent;

    this._tripComponent = new TripPointView(this._tripCard);
    this._editTripComponent = new EditPointView(this._tripCard);

    this._tripComponent.setEditClickHandler(this._handleEditClick);
    this._tripEditComponent.setFormSubmitHandler(this._handleFormSubmit);
    this._tripEditComponent.setEditFormCloseHandler(this._handleCloseFormClick);

    if (prevTripComponent === null || prevTripEditComponent === null) {
      render(this._tripListContainer, this._tripComponent, RenderPosition.BEFOREEND);
    }

    if (this._tripListContainer.getElement().contains(prevTripComponent.getElement())) {
      replace(this._tripComponent, prevTripComponent);
    }

    remove(prevTripComponent);
    remove(prevTripEditComponent);
  }

  destroy() {
    remove(this._tripComponent);
    remove(this._tripEditComponent);
  }

  _replaceTripToForm() {
    replace(this._editTripComponent, this._tripComponent);
    document.addEventListener(`keydown`, this._escKeyDownHandler);
  }

  _replaceFormToCard() {
    replace(this._tripComponent, this._editTripComponent);
    document.removeEventListener(`keydown`, this._escKeyDownHandler);
  }

  _escKeyDownHandler(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      this._replaceFormToCard();
    }
  }

  _handleEditClick() {
    this._replaceTripToForm();
  }

  _handleFormSubmitClick() {
    this._replaceFormToCard();
  }

  _handleCloseFormClick() {
    this._replaceFormToCard();
  }
}

export default TripPoint;
