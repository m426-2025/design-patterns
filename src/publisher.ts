import { Subscriber } from "./subscriber.js";
import { ParkingLotEvent } from "./event.";

export interface Publisher {
  subscribe(subscriber: Subscriber): void;
  unsubscribe(subscriber: Subscriber): void;
  notify(event: ParkingLotEvent): void;
}
