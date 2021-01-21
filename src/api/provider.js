import PointsModel from "../model/points.js";
import DataStorage from "../dataStorage.js";
import {isOnline} from "../utils/common.js";

const getSyncedPoints = (items) => {
  return items.filter(({success}) => success)
    .map(({payload}) => payload.point);
};

const createPointsStoreStructure = (items) => {
  return items.reduce((acc, current) => {
    return Object.assign({}, acc, {
      [current.id]: current,
    });
  }, {});
};

class Provider {
  constructor(api, pointsStore, offersStore, destinationsStore) {
    this._api = api;
    this._pointsStore = pointsStore;
    this._offersStore = offersStore;
    this._destinationsStore = destinationsStore;
  }

  getAllData() {
    if (isOnline()) {
      return this._api.getAllData()
        .then(([points, offers, destinations]) => {
          const pointsData = createPointsStoreStructure(points.map(PointsModel.adaptToServer));
          DataStorage.setOffers(offers);
          DataStorage.setDestinations(destinations);
          this._pointsStore.setItems(pointsData);
          this._offersStore.setItems(offers);
          this._destinationsStore.setItems(destinations);
          return points;
        });
    }
    const storePoints = Object.values(this._pointsStore.getItems());
    const storeOffers = Object.values(this._offersStore.getItems());
    const storeDestinations = Object.values(this._destinationsStore.getItems());
    DataStorage.setOffers(storeOffers);
    DataStorage.setDestinations(storeDestinations);

    return Promise.resolve(storePoints.map(PointsModel.adaptToClient));
  }

  updatePoint(point) {
    if (isOnline()) {
      return this._api.updatePoint(point)
        .then((updatedPoint) => {
          this._pointsStore.setItem(updatedPoint.id, PointsModel.adaptToServer(updatedPoint));
          return updatedPoint;
        });
    }

    this._pointsStore.setItem(point.id, PointsModel.adaptToServer(Object.assign({}, point)));

    return Promise.resolve(point);
  }

  addPoint(point) {
    if (isOnline()) {
      return this._api.addPoint(point)
        .then((newPoint) => {
          this._pointsStore.setItem(newPoint.id, PointsModel.adaptToServer(newPoint));
          return newPoint;
        });
    }

    return Promise.reject(new Error(`Add point failed`));
  }

  deletePoint(point) {
    if (isOnline()) {
      return this._api.deletePoint(point)
        .then(() => this._pointsStore.removeItem(point.id));
    }

    return Promise.reject(new Error(`Delete point failed`));
  }

  sync() {
    if (isOnline()) {
      const storePoints = Object.values(this._pointsStore.getItems());

      return this._api.sync(storePoints)
        .then((response) => {
          const createdPoints = getSyncedPoints(response.created);
          const updatedPoints = getSyncedPoints(response.updated);

          const items = createPointsStoreStructure([...createdPoints, ...updatedPoints]);
          this._pointsStore.setItems(items);
        });

    }

    return Promise.reject(new Error(`Sync data failed`));
  }
}

export default Provider;
