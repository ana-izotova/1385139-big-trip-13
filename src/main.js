import {createTripInfoTemplate} from "./view/trip-info.js";
import {createMenuTemplate} from "./view/menu.js";
import {createTripFiltersTemplate} from "./view/filters.js";
import {createTripSortTemplate} from "./view/sort.js";
import {createTripListTemplate} from "./view/trip-list.js";
import {createTripPointTemplate} from "./view/trip-point.js";
import {createEditFormTemplate} from "./view/edit-point.js";
import {cards} from "./mock/event-cards.js";

const render = (container, content, position = `beforeend`) => {
  container.insertAdjacentHTML(position, content);
};

const pageHeader = document.querySelector(`.page-header`);
const tripMainElement = pageHeader.querySelector(`.trip-main`);
const tripControlsElement = tripMainElement.querySelector(`.trip-main__trip-controls`);
const pageMain = document.querySelector(`.page-body__page-main`);
const tripEventsSection = pageMain.querySelector(`.trip-events`);

render(tripMainElement, createTripInfoTemplate(cards), `afterbegin`);
render(tripControlsElement, createMenuTemplate(), `afterbegin`);
render(tripControlsElement, createTripFiltersTemplate());
render(tripEventsSection, createTripSortTemplate());
render(tripEventsSection, createTripListTemplate());

const tripList = tripEventsSection.querySelector(`.trip-events__list`);
render(tripList, createEditFormTemplate(cards[0]));

for (let i = 1; i < cards.length; i += 1) {
  render(tripList, createTripPointTemplate(cards[i]));
}

