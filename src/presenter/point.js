import TripPointView from "../view/trip-point.js";
import EditPointView from "../view/edit-point.js";
import {remove, render, RenderPosition, replace} from "../utils/render.js";
import {isDatesEqual} from "../utils/trip.js";
import {UserAction, UpdateType, EscKeyEvent} from "../const.js";
import {isOnline} from "../utils/common.js";
import {toast} from "../utils/toast/toast.js";

const Mode = {
  DEFAULT: `DEFAULT`,
  EDITING: `EDITING`
};

const State = {
  SAVING: `SAVING`,
  DELETING: `DELETING`,
  ABORTING: `ABORTING`
};

class Point {
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
    this._handleDeleteClick = this._handleDeleteClick.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
  }

  init(tripCard) {
    this._tripCard = tripCard;

    const prevTripComponent = this._tripComponent;
    const prevTripEditComponent = this._tripEditComponent;

    this._tripComponent = new TripPointView(this._tripCard);
    this._tripEditComponent = new EditPointView(this._tripCard, false);

    this._tripComponent.setEditClickHandler(this._handleEditClick);
    this._tripComponent.setFavouriteClickHandler(this._handleFavouriteClick);
    this._tripEditComponent.setFormSubmitHandler(this._handleFormSubmit);
    this._tripEditComponent.setEditFormCloseHandler(this._handleCloseFormClick);
    this._tripEditComponent.setDeleteClickHandler(this._handleDeleteClick);

    if (prevTripComponent === null || prevTripEditComponent === null) {
      render(this._tripListContainer, this._tripComponent, RenderPosition.BEFOREEND);
      return;
    }

    if (this._mode === Mode.DEFAULT) {
      replace(this._tripComponent, prevTripComponent);
    }

    if (this._mode === Mode.EDITING) {
      replace(this._tripComponent, prevTripEditComponent);
      this._mode = Mode.DEFAULT;
    }

    remove(prevTripComponent);
    remove(prevTripEditComponent);
  }

  destroy() {
    remove(this._tripComponent);
    remove(this._tripEditComponent);
  }

  setViewState(state) {
    const resetFormState = () => {
      this._tripEditComponent.updateData({
        isDisabled: false,
        isSaving: false,
        isDeleting: false
      });
    };

    switch (state) {
      case State.SAVING:
        this._tripEditComponent.updateData({
          isDisabled: true,
          isSaving: true
        });
        break;
      case State.DELETING:
        this._tripEditComponent.updateData({
          isDisabled: true,
          isDeleting: true
        });
        break;
      case State.ABORTING:
        this._tripComponent.shake(resetFormState);
        this._tripEditComponent.shake(resetFormState);
        break;
    }
  }

  resetView() {
    if (this._mode !== Mode.DEFAULT) {
      this._tripEditComponent.reset(this._tripCard);
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
    if (evt.key === EscKeyEvent.ESCAPE || evt.key === EscKeyEvent.ESC) {
      evt.preventDefault();
      this._tripEditComponent.reset(this._tripCard);
      this._replaceFormToCard();
    }
  }

  _handleEditClick() {
    if (!isOnline()) {
      toast(`You can't edit point offline`);
      this._tripComponent.shake();
      return;
    }

    this._replaceTripToForm();
  }

  _handleFavouriteClick() {
    this._changeData(
        UserAction.UPDATE_POINT,
        UpdateType.PATCH,
        Object.assign(
            {},
            this._tripCard,
            {
              isFavourite: !this._tripCard.isFavourite
            }
        )
    );
  }

  _handleFormSubmit(update) {
    if (!isOnline()) {
      toast(`You can't save point offline`);
      this._tripEditComponent.shake();
      return;
    }

    const isMinorUpdate =
      !isDatesEqual(this._tripCard.startDate, update.startDate) ||
      !isDatesEqual(this._tripCard.endDate, update.endDate) ||
      this._tripCard.price !== update.price;

    this._changeData(
        UserAction.UPDATE_POINT,
        isMinorUpdate ? UpdateType.MINOR : UpdateType.PATCH,
        update
    );
  }

  _handleDeleteClick(point) {
    if (!isOnline()) {
      toast(`You can't delete point offline`);
      this._tripEditComponent.shake();
      return;
    }

    this._changeData(
        UserAction.DELETE_POINT,
        UpdateType.MINOR,
        point
    );
  }

  _handleCloseFormClick() {
    this._tripEditComponent.reset(this._tripCard);
    this._replaceFormToCard();
  }
}

export default Point;
export {State};
