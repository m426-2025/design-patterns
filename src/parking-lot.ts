export interface ParkingLotEvent {
  action: "enter" | "exit";
  name: string;
  occupied: number;
  capacity: number;
}

export interface Subscriber {
  update(event: ParkingLotEvent): void;
}

export interface Publisher {
  subscribe(subscriber: Subscriber): void;
  unsubscribe(subscriber: Subscriber): void;
  notify(event: ParkingLotEvent): void;
}

export class ParkingLot implements Publisher {
  public occupied: number = 0;
  private subscribers: Subscriber[] = [];

  constructor(
    public name: string,
    public capacity: number,
  ) {}

  subscribe(subscriber: Subscriber): void {
    this.subscribers.push(subscriber);
  }

  unsubscribe(subscriber: Subscriber): void {
    this.subscribers = this.subscribers.filter(s => s !== subscriber);
  }

  notify(event: ParkingLotEvent): void {
    for (const subscriber of this.subscribers) {
      subscriber.update(event);
    }
  }

  enter() {
    if (!this.isFull()) {
      this.occupied++;
      this.notify({
        action: "enter",
        name: this.name,
        occupied: this.occupied,
        capacity: this.capacity
      });
    } else {
      throw new Error(`the parking lot is full`);
    }
  }

  exit() {
    if (!this.isEmpty()) {
      this.occupied--;
      this.notify({
        action: "exit",
        name: this.name,
        occupied: this.occupied,
        capacity: this.capacity
      });
    } else {
      throw new Error(`the parking lot is empty`);
    }
  }

  isFull() {
    return this.occupied == this.capacity;
  }

  isEmpty() {
    return this.occupied == 0;
  }
}
