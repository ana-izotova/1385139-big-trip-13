import Observer from "../utils/observer.js";

class Offers extends Observer {
  constructor() {
    super();

    this._offers = [];
  }

  setOffers(offers) {
    this._offers = offers;
  }

  getOffers() {
    return this._offers;
  }
}

export default Offers;
