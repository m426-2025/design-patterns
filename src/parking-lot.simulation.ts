
import { ParkingLot, Display } from "./parking-lot.js";

const maxFillIntervalMillis = 1000;
const maxEmptyIntervalMillis = 2000;
const initialFillPhaseMillis = 5000;

const sleep = (millis: number) => new Promise((r) => setTimeout(r, millis));

const rand = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min; 

const fill = async (lot: ParkingLot) => {
  console.log(`Starting to fill ${lot.name}`);
  while (!lot.isFull()) {
    await sleep(rand(0, maxFillIntervalMillis));
    try {
      lot.enter(); 
    } catch (error) {
      console.warn(`${lot.name} filling error: ${error.message}`);
      break; 
    }
  }
  console.log(`${lot.name} is now full or filling stopped.`);
};

const empty = async (lot: ParkingLot) => {
  console.log(`Starting to empty ${lot.name}`);
  while (!lot.isEmpty()) {
    await sleep(rand(0, maxEmptyIntervalMillis));
    try {
      lot.exit(); 
    } catch (error) {
      console.warn(`${lot.name} emptying error: ${error.message}`);
      break; 
    }
  }
  console.log(`${lot.name} is now empty or emptying stopped.`);
};

async function runSimulation() {
  const bahnhofParking = new ParkingLot("Bahnhof Parking", 10);


  const parkingDisplay = new Display("Main Display");
  bahnhofParking.subscribe(parkingDisplay);

  console.log("Simulation started.");


  const fillerPromise = fill(bahnhofParking);
  await sleep(initialFillPhaseMillis); 
  const emptierPromise = empty(bahnhofParking);

  await fillerPromise;
  await emptierPromise;

  console.log("Simulation finished.");
  bahnhofParking.unsubscribe(parkingDisplay);
}

runSimulation().catch(error => console.error("Simulation failed:", error));