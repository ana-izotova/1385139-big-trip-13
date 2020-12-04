import AbstractView from "./abstract.js";

const createLoadingTemplate = () => {
  return `<p class="trip-events__msg">Loading...</p>`;
};

class Loading extends AbstractView {
  getTemplate() {
    return createLoadingTemplate();
  }
}

export default Loading;
