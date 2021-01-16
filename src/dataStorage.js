class DataStorage {
  constructor() {
    this._offers = [];
    this._destinations = [];
  }

  static setOffers(offers) {
    this._offers = offers;
  }

  static setDestinations(destinations) {
    this._destinations = destinations;
  }

  static getOffers() {
    return this._offers;
  }

  static getDestinations() {
    return this._destinations;
  }
}

export default DataStorage;
