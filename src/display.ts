import { Subscriber } from "./subscriber.js";
import { ParkingLotEvent } from "./event..js";

export class Display implements Subscriber {
  constructor(private name: string) {}

  update(event: ParkingLotEvent): void {
    console.log(
      `[${this.name}] ${event.parkingLotName}: ${event.occupied}/${event.capacity} occupied — car ${event.type}ed`
    );
  }
}
