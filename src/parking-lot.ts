import { Publisher } from "./publisher.js";
import { Subscriber } from "./subscriber.js";
import { ParkingLotEvent } from "./event.";

export class ParkingLot implements Publisher {
  public occupied: number = 0;
  private subscribers: Subscriber[] = [];

  constructor(
    public name: string,
    public capacity: number
  ) {}

  subscribe(subscriber: Subscriber): void {
    this.subscribers.push(subscriber);
  }

  unsubscribe(subscriber: Subscriber): void {
    this.subscribers = this.subscribers.filter((s) => s !== subscriber);
  }

  notify(event: ParkingLotEvent): void {
    for (const sub of this.subscribers) {
      sub.update(event);
    }
  }

  private emitEvent(type: "enter" | "exit") {
    const event: ParkingLotEvent = {
      parkingLotName: this.name,
      occupied: this.occupied,
      capacity: this.capacity,
      type,
    };
    this.notify(event);
  }

  enter() {
    if (!this.isFull()) {
      this.occupied++;
      this.emitEvent("enter");
    } else {
      throw new Error(`The parking lot ${this.name} is full`);
    }
  }

  exit() {
    if (!this.isEmpty()) {
      this.occupied--;
      this.emitEvent("exit");
    } else {
      throw new Error(`The parking lot ${this.name} is empty`);
    }
  }

  isFull() {
    return this.occupied === this.capacity;
  }

  isEmpty() {
    return this.occupied === 0;
  }
}
