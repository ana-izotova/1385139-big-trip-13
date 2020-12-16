import {destinations, getAvailaibleOffers, emptyCard} from "../mock/event-cards.js";
import SmartView from "./smart.js";

const createEditFormTemplate = (tripCard) => {
  const {type, startDate, endDate, destination, offers, description, photos, price, id} = tripCard;

  return `<li class="trip-events__item">
    <form class="event event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-${id}">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-${id}" type="checkbox">

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
          </div>
        </div>

        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-${id}">
            ${type}
          </label>
          <input class="event__input  event__input--destination" id="event-destination-${id}" type="text" name="event-destination" value="${destination}" list="destination-list-${id}">
          <datalist id="destination-list-${id}">
            ${Object.keys(destinations).map((item) => {
    return `<option value="${destinations[item].name}"></option>`;
  }).join(``)}
          </datalist>
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-${id}">From</label>
          <input class="event__input  event__input--time" id="event-start-time-${id}" type="text" name="event-start-time" value="${startDate.format(`DD/MM/YY HH:mm`)}">
          &mdash;
          <label class="visually-hidden" for="event-end-time-${id}">To</label>
          <input class="event__input  event__input--time" id="event-end-time-${id}" type="text" name="event-end-time" value="${endDate.format(`DD/MM/YY HH:mm`)}">
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-${id}">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-${id}" type="text" name="event-price" value="${price}">
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
        <button class="event__reset-btn" type="reset">Delete</button>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </header>
      <section class="event__details">
        ${Object.keys(offers).length === 0 ? `` : `
          <section class="event__section  event__section--offers">
          <h3 class="event__section-title  event__section-title--offers">Offers</h3>
          <div class="event__available-offers">
          ${Object.values(offers).map((offer) => {
    return `<div class="event__offer-selector">
                      <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offer.type}-${id}" type="checkbox" name="event-offer-${offer.type}" ${offer.checked ? `checked` : ``}>
                      <label class="event__offer-label" for="event-offer-${offer.type}-${id}">
                        <span class="event__offer-title">${offer.name}</span>
                        &plus;&euro;&nbsp;
                        <span class="event__offer-price">${offer.price}</span>
                      </label>
                    </div>`;
  }).join(``)
}
          </div>
          </section>`
}

        <section class="event__section  event__section--destination">
          <h3 class="event__section-title  event__section-title--destination">Destination</h3>
          <p class="event__destination-description">${description}</p>

        ${photos.length === 0 ? `` : `
          <div class="event__photos-container">
            <div class="event__photos-tape">
              ${photos.map((photo) => `<img class="event__photo" src="${photo}" alt="Event photo">`).join(``)}
            </div>
          </div>`
}
        </section>
      </section>
    </form>
  </li>`;
};

class EditPoint extends SmartView {
  constructor(tripCard = emptyCard) {
    super();
    this._data = EditPoint.parseTripCardToData(tripCard);

    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._destinationChangeHandler = this._destinationChangeHandler.bind(this);
    this._closeEditFormHandler = this._closeEditFormHandler.bind(this);
    this._eventTypeSelectHandler = this._eventTypeSelectHandler.bind(this);
    this._priceInputHandler = this._priceInputHandler.bind(this);
    this._offersClickHandler = this._offersClickHandler.bind(this);

    this._setInnerHandlers();
  }

  static parseTripCardToData(tripCard) {
    return Object.assign({}, tripCard);
  }

  static parseDataToTripCard(data) {
    return Object.assign({}, data);
  }

  reset(tripCard) {
    this.updateData(
        EditPoint.parseTripCardToData(tripCard)
    );
  }

  getTemplate() {
    return createEditFormTemplate(this._data);
  }

  _eventTypeSelectHandler(evt) {
    if (evt.target.name === `event-type`) {
      const newType = evt.target.value;
      this.updateData({
        type: newType,
        offers: getAvailaibleOffers(newType)
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
    if (evt.target.value.length === 0) {
      evt.target.setCustomValidity(`Choose your destination point`);
    } else if (!Object.keys(destinations).includes(evt.target.value)) {
      evt.target.setCustomValidity(`Please choose from the given points`);
    } else {
      evt.target.setCustomValidity(``);
      const newDestination = evt.target.value;
      this.updateData({
        destination: newDestination,
        photos: destinations[newDestination].photos,
        description: destinations[newDestination].description
      });
    }
    evt.target.reportValidity();
  }

  _priceInputHandler(evt) {
    evt.preventDefault();
    if (evt.target.value.length === 0) {
      evt.target.setCustomValidity(`Type in event price`);
    } else if (!/^\d+$/.test(evt.target.value)) {
      evt.target.setCustomValidity(`Digits only`);
    } else {
      evt.target.setCustomValidity(``);
      this.updateData({
        price: evt.target.value
      }, true);
    }
    evt.target.reportValidity();
  }

  _offersClickHandler(evt) {
    const state = evt.target.checked;
    const type = evt.target.name.slice(12);

    this.updateData({
      offers: Object.assign(
          {},
          this._data.offers,
          {[type]: Object.assign({}, this._data.offers[type], {checked: state})}
      )
    }, true);
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this.setFormSubmitHandler(this._callback.formSubmit);
    this.setEditFormCloseHandler(this._callback.closeEditForm);
  }

  _setInnerHandlers() {
    this.getElement()
      .querySelector(`.event__type-group`)
      .addEventListener(`click`, this._eventTypeSelectHandler);
    this.getElement()
      .querySelector(`.event__input--destination`)
      .addEventListener(`change`, this._destinationChangeHandler);
    this.getElement()
      .querySelector(`.event__input--price`)
      .addEventListener(`input`, this._priceInputHandler);

    const availableOffers = this.getElement().querySelectorAll(`.event__available-offers input`);
    if (availableOffers) {
      availableOffers.forEach((offer) => offer.addEventListener(`click`, this._offersClickHandler));
    }
  }

  setFormSubmitHandler(callback) {
    this._callback.formSubmit = callback;
    this.getElement()
      .querySelector(`form`)
      .addEventListener(`submit`, this._formSubmitHandler);
  }

  setEditFormCloseHandler(callback) {
    this._callback.closeEditForm = callback;
    this.getElement()
      .querySelector(`.event__rollup-btn`)
      .addEventListener(`click`, this._closeEditFormHandler);
  }
}

export default EditPoint;
