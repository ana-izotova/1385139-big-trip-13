import AbstractView from "./abstract.js";

const createFilterItemTemplate = (filter, currentFilterType) => {
  const {type, name, amount} = filter;

  return (
    `<div class="trip-filters__filter">
      <input
        id="filter-${type}"
        class="trip-filters__filter-input  visually-hidden"
        type="radio"
        name="trip-filter"
        value="${type}"
        ${type === currentFilterType ? `checked` : ``}
        ${amount === 0 ? `disabled` : ``}
       >
       <label
          class="trip-filters__filter-label"
          for="filter-${type}">
          ${name}
       </label>
    </div>`
  );
};

const createFilterTemplate = (filterItems, currentFilterType) => {
  const filterItemsTemplate = filterItems
    .map((filter) => createFilterItemTemplate(filter, currentFilterType))
    .join(``);

  return `<div><h2 class="visually-hidden">Filter events</h2>
          <form class="trip-filters" action="#" method="get">

            ${filterItemsTemplate}

            <button class="visually-hidden" type="submit">Accept filter</button>
          </form></div>`;
};

class Filter extends AbstractView {
  constructor(filters, currentFilterType) {
    super();
    this._filters = filters;
    this._currentFilter = currentFilterType;

    this._filterTypeChangeHandler = this._filterTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return createFilterTemplate(this._filters, this._currentFilter);
  }

  setFilterTypeChangeHandler(callback) {
    this._callback.filterTypeChange = callback;
    this.getElement()
      .querySelector(`.trip-filters`)
      .addEventListener(`change`, this._filterTypeChangeHandler);
  }

  _filterTypeChangeHandler(evt) {
    evt.preventDefault();
    this._callback.filterTypeChange(evt.target.value);
  }
}

export default Filter;
