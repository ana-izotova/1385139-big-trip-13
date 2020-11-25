import {renderTemplate} from "./view/utils.js";
import {createTripInfoTemplate} from "./view/trip-info.js";
import {createMenuTemplate} from "./view/menu.js";
import {createTripFiltersTemplate} from "./view/filters.js";
import {createTripSortTemplate} from "./view/sort.js";
import {createTripListTemplate} from "./view/trip-list.js";
import {createTripPointTemplate} from "./view/trip-point.js";
import {createEditFormTemplate} from "./view/edit-point.js";
import {cards} from "./mock/event-cards.js";

const pageHeader = document.querySelector(`.page-header`);
const tripMainElement = pageHeader.querySelector(`.trip-main`);
const tripControlsElement = tripMainElement.querySelector(`.trip-main__trip-controls`);
const pageMain = document.querySelector(`.page-body__page-main`);
const tripEventsSection = pageMain.querySelector(`.trip-events`);

renderTemplate(tripMainElement, createTripInfoTemplate(cards), `afterbegin`);
renderTemplate(tripControlsElement, createMenuTemplate(), `afterbegin`);
renderTemplate(tripControlsElement, createTripFiltersTemplate());
renderTemplate(tripEventsSection, createTripSortTemplate());
renderTemplate(tripEventsSection, createTripListTemplate());

const tripList = tripEventsSection.querySelector(`.trip-events__list`);
renderTemplate(tripList, createEditFormTemplate(cards[0]));

for (let i = 1; i < cards.length; i += 1) {
  renderTemplate(tripList, createTripPointTemplate(cards[i]));
}

