import dayjs from "dayjs";
import {getRandomInt} from "../view/utils.js";

const MAX_OFFERS_AMOUNT = 5;
const MAX_TRIP_TIME = 7;
const MAX_PHOTOS_AMOUNT = 5;
const CARDS_AMOUNT = 20;

const Price = {
  min: 10,
  max: 100
};

const offers = [
  {
    name: `Add luggage`,
    type: `luggage`,
    category: [`train`, `bus`, `flight`],
    price: 50,
    checked: Boolean(getRandomInt())
  },
  {
    name: `Add meal`,
    type: `meal`,
    category: [`train`, `flight`],
    price: 15,
    checked: Boolean(getRandomInt())
  },
  {
    name: `Switch to comfort`,
    type: `comfort`,
    category: [`train`, `flight`],
    price: 80,
    checked: Boolean(getRandomInt())
  },
  {
    name: `Choose seats`,
    type: `seats`,
    category: [`train`, `bus`, `flight`],
    price: 15,
    checked: Boolean(getRandomInt())
  },
  {
    name: `Order Uber`,
    type: `taxi`,
    category: `taxi`,
    price: 20,
    checked: Boolean(getRandomInt())
  },
  {
    name: `Rent a car`,
    type: `car`,
    category: `drive`,
    price: 200,
    checked: Boolean(getRandomInt())
  },
  {
    name: `Add breakfast`,
    type: `breakfast`,
    category: `check-in`,
    price: 50,
    checked: Boolean(getRandomInt())
  },
  {
    name: `Book tickets`,
    type: `tickets`,
    category: `sightseeing`,
    price: 40,
    checked: Boolean(getRandomInt())
  },
  {
    name: `Lunch in city`,
    type: `lunch`,
    category: `sightseeing`,
    price: 30,
    checked: Boolean(getRandomInt())
  }
];

const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i -= 1) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const text = [
  `Cat ipsum dolor sit amet, skid on floor, crash into wall but crusty butthole yet jump on human and sleep on her all night long be long in the bed, purr in the morning and then give a bite to every human around for not waking up request food, purr loud scratch the walls, the floor, the windows, the humans.`,
  `Stick butt in face run up and down stairs and cat sit like bread, meow loudly just to annoy owners.`,
  `Love me! kitty ask to go outside and ask to come inside and ask to go outside and ask to come inside chase after silly colored fish toys around the house.`,
  `I is not fat, i is fluffy cuddle no cuddle cuddle love scratch scratch.`,
  `Blow up sofa in 3 seconds sit by the fire yet the fat cat sat on the mat bat away with paws.`,
  `Headbutt owner's knee cry louder at reflection hell is other people so mew.`,
  `Cat playing a fiddle in hey diddle diddle? cat jumps and falls onto the couch purrs and wakes up in a new dimension filled with kitty litter meow meow yummy there is a bunch of cats hanging around eating catnip so pet me pet me pet me pet me, bite, scratch, why are you petting me climb into cupboard and lick the salt off rice cakes toilet paper attack claws fluff everywhere meow miao french ciao litterbox jump five feet high and sideways when a shadow moves, yet hack up furballs.`,
  `Loves cheeseburgers more napping, more napping all the napping is exhausting cat playing a fiddle in hey diddle diddle? so lick arm hair so i like big cats and i can not lie or meeeeouw.`
];

const destinations = [`Amsterdam`, `Geneva`, `Chamonix`, `Monaco`];

const getRandomPhoto = () => `http://picsum.photos/248/152?r=${Math.random()}`;

const generateDescription = (content) => {
  return shuffleArray(content)
    .slice(0, getRandomInt(1, 4))
    .join(` `);
};

const getRandomArrayItem = (arr) => {
  return arr[Math.floor(Math.random() * arr.length)];
};

const types = [
  `taxi`,
  `bus`,
  `train`,
  `ship`,
  `transport`,
  `drive`,
  `flight`,
  `check-in`,
  `sightseeing`,
  `restaurant`
];

export const generateDate = () => {
  const date = dayjs();
  const tripTime = getRandomInt(0, MAX_TRIP_TIME);
  const start = date.add(getRandomInt(1, MAX_TRIP_TIME), `day`);
  const end = start.add(tripTime, `day`).add(getRandomInt(0, 24), `hour`).add(getRandomInt(0, 60), `minute`);
  return [start, end];
};

const generateEventCard = () => {
  const [startDate, endDate] = generateDate();
  const type = getRandomArrayItem(types);
  return {
    type,
    destination: getRandomArrayItem(destinations),
    startDate,
    endDate,
    offers: shuffleArray(offers.filter((offer) => offer.category.includes(type))).slice(0, getRandomInt(0, MAX_OFFERS_AMOUNT)),
    photos: Array(getRandomInt(0, MAX_PHOTOS_AMOUNT))
      .fill()
      .map(getRandomPhoto),
    description: generateDescription(text),
    price: getRandomInt(Price.min, Price.max),
    favourite: Boolean(getRandomInt())
  };
};

export const generateEventCards = (amount) => {
  return Array(amount)
    .fill()
    .map(() => generateEventCard())
    .sort(
        (currentCard, nextCard) => currentCard.startDate.diff(nextCard.startDate)
    );
};

const cards = generateEventCards(CARDS_AMOUNT);

export {offers, destinations, cards};
