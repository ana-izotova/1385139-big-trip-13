import TripPointView from "../view/trip-point.js";
import EditPointView from "../view/edit-point.js";
import {remove, render, RenderPosition, replace} from "../utils/render.js";

const Mode = {
  DEFAULT: `DEFAULT`,
  EDITING: `EDITING`
};

class TripPoint {
  constructor(tripListContainer, changeData, changeMode) {
    this._tripListContainer = tripListContainer;
    this._changeData = changeData;
    this._changeMode = changeMode;

    this._tripComponent = null;
    this._tripEditComponent = null;
    this._mode = Mode.DEFAULT;

    this._handleEditClick = this._handleEditClick.bind(this);
    this._handleFavouriteClick = this._handleFavouriteClick.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleCloseFormClick = this._handleCloseFormClick.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
  }

  init(tripCard) {
    this._tripCard = tripCard;

    const prevTripComponent = this._tripComponent;
    const prevTripEditComponent = this._tripEditComponent;

    this._tripComponent = new TripPointView(this._tripCard);
    this._tripEditComponent = new EditPointView(this._tripCard);

    this._tripComponent.setEditClickHandler(this._handleEditClick);
    this._tripComponent.setFavouriteClickHandler(this._handleFavouriteClick);
    this._tripEditComponent.setFormSubmitHandler(this._handleFormSubmit);
    this._tripEditComponent.setEditFormCloseHandler(this._handleCloseFormClick);

    if (prevTripComponent === null || prevTripEditComponent === null) {
      render(this._tripListContainer, this._tripComponent, RenderPosition.BEFOREEND);
      return;
    }

    if (this._mode === Mode.DEFAULT) {
      replace(this._tripComponent, prevTripComponent);
    }

    if (this._mode === Mode.EDITING) {
      replace(this._tripEditComponent, prevTripEditComponent);
    }

    remove(prevTripComponent);
    remove(prevTripEditComponent);
  }

  destroy() {
    remove(this._tripComponent);
    remove(this._tripEditComponent);
  }

  resetView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceFormToCard();
    }
  }

  _replaceTripToForm() {
    replace(this._tripEditComponent, this._tripComponent);
    document.addEventListener(`keydown`, this._escKeyDownHandler);
    this._changeMode();
    this._mode = Mode.EDITING;
  }

  _replaceFormToCard() {
    replace(this._tripComponent, this._tripEditComponent);
    document.removeEventListener(`keydown`, this._escKeyDownHandler);
    this._mode = Mode.DEFAULT;
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

  _handleFavouriteClick() {
    this._changeData(
        Object.assign(
            {},
            this._tripCard,
            {
              favourite: !this._tripCard.favourite
            }
        )
    );
  }

  _handleFormSubmit(tripCard) {
    this._changeData(tripCard);
    this._replaceFormToCard();
  }

  _handleCloseFormClick() {
    this._replaceFormToCard();
  }
}

export default TripPoint;
