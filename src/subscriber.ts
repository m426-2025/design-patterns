import { ParkingLotEvent } from "./event.";

export interface Subscriber {
  update(event: ParkingLotEvent): void;
}
