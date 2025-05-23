import { ParkingLot, Display } from "./parking-lot.js";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const rand = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1));

const bahnhofParking = new ParkingLot("Bahnhof Parking", 100);
const screen = new Display("MainDisplay");

bahnhofParking.subscribe(screen);

const fill = async () => {
  while (!bahnhofParking.isFull()) {
    await sleep(rand(0, 1000));
    bahnhofParking.enter();
  }
};

const empty = async () => {
  while (!bahnhofParking.isEmpty()) {
    await sleep(rand(0, 2000));
    bahnhofParking.exit();
  }
};

await fill();
await sleep(5000);
await empty();
