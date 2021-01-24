import SmartView from "./smart.js";
import DataStorage from "../dataStorage.js";
import flatpickr from "flatpickr";
import "../../node_modules/flatpickr/dist/flatpickr.min.css";
import dayjs from "dayjs";
import {getEventDuration, getAvailableOffers} from "../utils/trip.js";

const emptyCard = {
  type: `taxi`,
  startDate: dayjs().add(1, `hour`),
  endDate: dayjs().add(4, `hour`),
  offers: [],
  destination: {
    name: ``,
    pictures: [],
    description: ``
  },
  price: 0,
  isFavourite: false
};

const createEditFormTypeTemplate = (type, id, isDisabled) => {
  return `<label class="event__type  event__type-btn" for="event-type-toggle-${id}">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-${id}" type="checkbox" ${isDisabled ? `disabled` : ``}>

          <div class="event__type-list">
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Event type</legend>

              <div class="event__type-item">
                <input id="event-type-taxi-${id}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="taxi"
                ${type === `taxi` ? `checked` : ``}>
                <label class="event__type-label  event__type-label--taxi" for="event-type-taxi-${id}">Taxi</label>
              </div>

              <div class="event__type-item">
                <input id="event-type-bus-${id}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="bus"
                ${type === `bus` ? `checked` : ``}>
                <label class="event__type-label  event__type-label--bus" for="event-type-bus-${id}">Bus</label>
              </div>

              <div class="event__type-item">
                <input id="event-type-train-${id}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="train"
                ${type === `train` ? `checked` : ``}>
                <label class="event__type-label  event__type-label--train" for="event-type-train-${id}">Train</label>
              </div>

              <div class="event__type-item">
                <input id="event-type-ship-${id}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="ship"
                ${type === `ship` ? `checked` : ``}>
                <label class="event__type-label  event__type-label--ship" for="event-type-ship-${id}">Ship</label>
              </div>

              <div class="event__type-item">
                <input id="event-type-transport-${id}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="transport"
                ${type === `transport` ? `checked` : ``}>
                <label class="event__type-label  event__type-label--transport" for="event-type-transport-${id}">Transport</label>
              </div>

              <div class="event__type-item">
                <input id="event-type-drive-${id}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="drive"
                ${type === `drive` ? `checked` : ``}>
                <label class="event__type-label  event__type-label--drive" for="event-type-drive-${id}">Drive</label>
              </div>

              <div class="event__type-item">
                <input id="event-type-flight-${id}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="flight"
                ${type === `flight` ? `checked` : ``}>
                <label class="event__type-label  event__type-label--flight" for="event-type-flight-${id}">Flight</label>
              </div>

              <div class="event__type-item">
                <input id="event-type-check-in-${id}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="check-in"
                ${type === `check-in` ? `checked` : ``}">
                <label class="event__type-label  event__type-label--check-in" for="event-type-check-in-${id}">Check-in</label>
              </div>

              <div class="event__type-item">
                <input id="event-type-sightseeing-${id}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="sightseeing"
                ${type === `sightseeing` ? `checked` : ``}>
                <label class="event__type-label  event__type-label--sightseeing" for="event-type-sightseeing-${id}">Sightseeing</label>
              </div>

              <div class="event__type-item">
                <input id="event-type-restaurant-${id}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="restaurant"
                ${type === `restaurant` ? `checked` : ``}>
                <label class="event__type-label  event__type-label--restaurant" for="event-type-restaurant-${id}">Restaurant</label>
              </div>
            </fieldset>
          </div>`;
};

const createEditFormDestinationTemplate = (type, id, destination, allDestinations, isDisabled) => {
  return `<label class="event__label  event__type-output" for="event-destination-${id}">
            ${type}
          </label>
          <input class="event__input  event__input--destination" id="event-destination-${id}" type="text" name="event-destination" value="${destination.name}" list="destination-list-${id}" ${isDisabled ? `disabled` : ``}>
          <datalist id="destination-list-${id}">
            ${allDestinations.map((item) => {
    return `<option value="${item.name}"></option>`;
  }).join(``)}
          </datalist>`;
};

const createEditFormTimeTemplate = (id, startDate, endDate, isDisabled) => {
  return `<label class="visually-hidden" for="event-start-time-${id}">From</label>
  <input class="event__input  event__input--time" id="event-start-time-${id}" type="text" name="event-start-time"
         value="${startDate.format(`DD/MM/YY HH:mm`)}" ${isDisabled ? `disabled` : ``}>
    &mdash;
    <label class="visually-hidden" for="event-end-time-${id}">To</label>
    <input class="event__input  event__input--time" id="event-end-time-${id}" type="text" name="event-end-time"
           value="${endDate.format(`DD/MM/YY HH:mm`)}" ${isDisabled ? `disabled` : ``}>`;
};

const createEditFormPriceTemplate = (id, price, isDisabled) => {
  return `<label class="event__label" for="event-price-${id}">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-${id}" type="number" min="0" name="event-price" value="${price}" required ${isDisabled ? `disabled` : ``}>`;
};

const createEditFormOffersTemplate = (offers, availableOffers, id, isDisabled) => {
  const isOffers = availableOffers.length > 0;
  return `${!isOffers ? `` : `
          <section class="event__section  event__section--offers">
          <h3 class="event__section-title  event__section-title--offers">Offers</h3>
          <div class="event__available-offers">
          ${availableOffers.map((offer) => {
    const {title, price} = offer;
    const offerType = title.split(` `).join(`-`).toLowerCase();
    const isSelected = Boolean(offers.find((item) => item.title === title));
    return `<div class="event__offer-selector">
                      <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offerType}-${id}" type="checkbox" name="event-offer-${offerType}" ${isSelected ? `checked` : ``} ${isDisabled ? `disabled` : ``}>
                      <label class="event__offer-label" for="event-offer-${offerType}-${id}">
                        <span class="event__offer-title">${title}</span>
                        &plus;&euro;&nbsp;
                        <span class="event__offer-price">${price}</span>
                      </label>
                    </div>`;
  }).join(``)
}
          </div>
          </section>`
  }`;
};

const createEditFormDescriptionTemplate = (description, isDescription) => {
  return `${!isDescription ? `` :
    `<p class="event__destination-description">${description}</p>`}`;
};

const createEditFormPicturesTemplate = (pictures, isPictures) => {
  return `${!isPictures ? `` : `
          <div class="event__photos-container">
            <div class="event__photos-tape">
              ${pictures.map((picture) => `<img class="event__photo" src="${picture.src}" alt="${picture.description}">`).join(``)}
            </div>
          </div>`
  }`;
};

const createEditFormDestinationInfoTemplate = (destination) => {
  const {name, description, pictures} = destination;
  const isDestinationName = name.length > 0;
  const isPictures = pictures.length > 0;
  const isDescription = description.length > 0;
  const descriptionTemplate = createEditFormDescriptionTemplate(description, isDescription);
  const picturesTemplate = createEditFormPicturesTemplate(pictures, isPictures);

  return `${!isDestinationName ? `` : `
  <section class="event__section  event__section--destination">
          <h3 class="event__section-title  event__section-title--destination">Destination</h3>
           ${descriptionTemplate}

        ${picturesTemplate}
        </section>`
  }`;
};

const createEditFormTemplate = (tripCard, availableOffers, allDestinations, isNewPoint) => {
  const {type, startDate, endDate, destination, offers, price, isDisabled, isSaving, isDeleting, isSubmitDisabled} = tripCard;
  const id = isNewPoint ? `new` : tripCard.id;

  const typeTemplate = createEditFormTypeTemplate(type, id, isDisabled);
  const destinationTemplate = createEditFormDestinationTemplate(type, id, destination, allDestinations, isDisabled);
  const timeTemplate = createEditFormTimeTemplate(id, startDate, endDate, isDisabled);
  const priceTemplate = createEditFormPriceTemplate(id, price, isDisabled);
  const offersTemplate = createEditFormOffersTemplate(offers, availableOffers, id, isDisabled);
  const destinationInfoTemplate = createEditFormDestinationInfoTemplate(destination);

  return `<li class="trip-events__item">
    <form class="event event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          ${typeTemplate}
        </div>

        <div class="event__field-group  event__field-group--destination">
          ${destinationTemplate}
        </div>

        <div class="event__field-group  event__field-group--time">
          ${timeTemplate}
        </div>

        <div class="event__field-group  event__field-group--price">
          ${priceTemplate}
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit" ${isDisabled || isSubmitDisabled ? `disabled` : ``}>${isSaving ? `Saving...` : `Save`}</button>
        <button class="event__reset-btn" type="reset" ${isDisabled ? `disabled` : ``}>${isNewPoint ? `Cancel` : `${isDeleting ? `Deleting...` : `Delete`}`}</button>
        ${isNewPoint ? `` : `<button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>`}
      </header>
      <section class="event__details">
        ${offersTemplate}

        ${destinationInfoTemplate}
      </section>
    </form>
  </li>`;
};

const flatpickrBasicSetup = {
  enableTime: true,
  altInput: true,
  altFormat: `d/m/y H:i`,
  dateFormat: `Y-m-d`
};

class EditPoint extends SmartView {
  constructor(tripCard = emptyCard, isNewPoint = true) {
    super();
    this._allDestinations = DataStorage.getDestinations();
    this._allOffers = DataStorage.getOffers();
    this._availableOffers = getAvailableOffers(this._allOffers, tripCard.type);

    this._data = EditPoint.parseTripCardToData(tripCard, this._availableOffers);
    this._isNewPoint = isNewPoint;
    this._datepickerStartDate = null;
    this._datepickerEndDate = null;

    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._formDeleteClickHandler = this._formDeleteClickHandler.bind(this);
    this._closeEditFormHandler = this._closeEditFormHandler.bind(this);
    this._destinationChangeHandler = this._destinationChangeHandler.bind(this);
    this._startDateChangeHandler = this._startDateChangeHandler.bind(this);
    this._endDateChangeHandler = this._endDateChangeHandler.bind(this);
    this._eventTypeSelectHandler = this._eventTypeSelectHandler.bind(this);
    this._priceInputHandler = this._priceInputHandler.bind(this);
    this._offersClickHandler = this._offersClickHandler.bind(this);

    this._setInnerHandlers();
    this._setDatePicker();
  }

  getTemplate() {
    return createEditFormTemplate(this._data, this._availableOffers, this._allDestinations, this._isNewPoint);
  }

  setFormSubmitHandler(callback) {
    this._callback.formSubmit = callback;
    this.getElement()
      .querySelector(`form`)
      .addEventListener(`submit`, this._formSubmitHandler);
  }

  setEditFormCloseHandler(callback) {
    this._callback.closeEditForm = callback;

    if (!this._isNewPoint) {
      this.getElement()
        .querySelector(`.event__rollup-btn`)
        .addEventListener(`click`, this._closeEditFormHandler);
    }
  }

  setDeleteClickHandler(callback) {
    this._callback.deleteClick = callback;
    this.getElement()
      .querySelector(`.event__reset-btn`)
      .addEventListener(`click`, this._formDeleteClickHandler);
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this.setFormSubmitHandler(this._callback.formSubmit);
    this.setDeleteClickHandler(this._callback.deleteClick);
    this._setDatePicker();

    if (!this._isNewPoint) {
      this.setEditFormCloseHandler(this._callback.closeEditForm);
    }
  }

  removeElement() {
    super.removeElement();

    if (this._datepickerStartDate || this._datepickerEndDate) {
      this._datepickerStartDate.destroy();
      this._datepickerEndDate.destroy();
      this._datepickerStartDate = null;
      this._datepickerEndDate = null;
    }
  }

  reset(tripCard) {
    this.updateData(
        EditPoint.parseTripCardToData(tripCard)
    );
  }

  _eventTypeSelectHandler(evt) {
    if (evt.target.name === `event-type`) {
      const newType = evt.target.value;
      this._availableOffers = getAvailableOffers(this._allOffers, newType);
      this.updateData({
        type: newType,
        offers: []
      });
    }
  }

  _formSubmitHandler(evt) {
    evt.preventDefault();
    this._callback.formSubmit(EditPoint.parseDataToTripCard(this._data));
  }

  _closeEditFormHandler() {
    this._callback.closeEditForm();
  }

  _destinationChangeHandler(evt) {
    const newCity = evt.target.value;
    const newDestination = this._allDestinations.find((destination) => destination.name === newCity);

    if (!newDestination) {
      evt.target.setCustomValidity(`You must choose actual destination point`);
      evt.target.style.border = `1px solid red`;
      evt.target.reportValidity();
      return;
    }

    this.updateData({
      destination: Object.assign({}, newDestination),
      isSubmitDisabled: false
    });
  }

  _priceInputHandler(evt) {
    this.updateData({
      price: Number(evt.target.value)
    }, true);
  }

  _offersClickHandler() {
    const newOffers = [];
    this.getElement()
      .querySelectorAll(`.event__offer-checkbox`)
      .forEach((offer, index) => {
        if (offer.checked) {
          newOffers.push(this._availableOffers[index]);
        }
      });

    this.updateData({offers: newOffers}, true);
  }

  _setDatePicker() {
    if (this._datepickerStartDate) {
      this._datepickerStartDate.destroy();
      this._datepickerStartDate = null;
    }

    if (this._datepickerEndDate) {
      this._datepickerEndDate.destroy();
      this._datepickerEndDate = null;
    }

    this._datepickerStartDate = flatpickr(
        this.getElement().querySelector(`input[name="event-start-time"]`),
        Object.assign(
            {},
            flatpickrBasicSetup,
            {
              minDate: this._isNewPoint ? Date.now() : ``,
              defaultDate: this._data.startDate.toDate(),
              onChange: this._startDateChangeHandler
            }
        )
    );

    this._datepickerEndDate = flatpickr(
        this.getElement().querySelector(`input[name="event-end-time"]`),
        Object.assign(
            {},
            flatpickrBasicSetup,
            {
              minDate: this._data.startDate.toDate(),
              defaultDate: this._data.endDate.toDate(),
              onChange: this._endDateChangeHandler
            }
        )
    );
  }

  _startDateChangeHandler([userDate]) {
    this.updateData({
      startDate: dayjs(userDate)
    });

    if (getEventDuration(this._data.startDate, this._data.endDate) < 0) {
      this.updateData({
        isSubmitDisabled: true
      });
      return;
    }

    this.updateData({
      isSubmitDisabled: false
    });
  }

  _endDateChangeHandler([userDate]) {
    this.updateData({
      endDate: dayjs(userDate)
    });

    if (getEventDuration(this._data.startDate, this._data.endDate) < 0) {
      this.updateData({
        isSubmitDisabled: true
      });
      return;
    }

    this.updateData({
      isSubmitDisabled: false
    });
  }

  _setInnerHandlers() {
    this.getElement()
      .querySelector(`.event__type-group`)
      .addEventListener(`change`, this._eventTypeSelectHandler);
    this.getElement()
      .querySelector(`.event__input--destination`)
      .addEventListener(`change`, this._destinationChangeHandler);
    this.getElement()
      .querySelector(`.event__input--price`)
      .addEventListener(`change`, this._priceInputHandler);

    const availableOffers = this.getElement().querySelectorAll(`.event__available-offers input`);
    if (availableOffers) {
      availableOffers.forEach((offer) => offer.addEventListener(`click`, this._offersClickHandler));
    }
  }

  _formDeleteClickHandler(evt) {
    evt.preventDefault();
    this._callback.deleteClick(EditPoint.parseDataToTripCard(this._data));
  }

  static parseTripCardToData(tripCard) {
    return Object.assign(
        {},
        tripCard,
        {
          isSubmitDisabled: !tripCard.destination.name,
          isDisabled: false,
          isSaving: false,
          isDeleting: false
        }
    );
  }

  static parseDataToTripCard(data) {
    const newData = Object.assign({}, data);
    delete newData.isSubmitDisabled;
    delete newData.isDisabled;
    delete newData.isSaving;
    delete newData.isDeleting;

    return newData;
  }
}

export default EditPoint;
