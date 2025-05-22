import { ParkingLot } from "./parking-lot.js";
import { Display } from "./display.js";

const maxFillIntervalMillis = 1000;
const maxEmptyIntervalMillis = 2000;
const initialFillPhaseMillis = 5000;

const sleep = (millis: number) => new Promise((r) => setTimeout(r, millis));

const rand = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1));

const fill = async (lot: ParkingLot) => {
  while (!lot.isFull()) {
    await sleep(rand(0, maxFillIntervalMillis));
    lot.enter();
    console.log(`a car entered the lot ${lot.name}`);
  }
};

const empty = async (lot: ParkingLot) => {
  while (!lot.isEmpty()) {
    await sleep(rand(0, maxEmptyIntervalMillis));
    lot.exit();
    console.log(`a car left the lot ${lot.name}`);
  }
};

const bahnhofParking = new ParkingLot("Bahnhof Parking", 100);
const display = new Display();
bahnhofParking.attach(display);

const filler = fill(bahnhofParking);
await sleep(initialFillPhaseMillis);
const emptier = empty(bahnhofParking);
await filler;
await emptier;
