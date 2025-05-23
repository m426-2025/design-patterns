export interface Subscriber {
  update(lot: ParkingLot, type: 'enter' | 'exit'): void;
}
export interface Publisher {
  subscribe(subscriber: Subscriber): void;
  unsubscribe(subscriber: Subscriber): void;
  notify(type: 'enter' | 'exit'): void;
}

export class ParkingLot implements Publisher {
  public occupied: number = 0;
  private subscribers: Subscriber[] = [];

  constructor(
    public name: string,
    public capacity: number,
  ) {}

  subscribe(subscriber: Subscriber): void {
    if (!this.subscribers.includes(subscriber)) {
      this.subscribers.push(subscriber);
    }
  }

  unsubscribe(subscriber: Subscriber): void {
    this.subscribers = this.subscribers.filter((s) => s !== subscriber);
  }

  notify(type: 'enter' | 'exit'): void {
    this.subscribers.forEach((subscriber) => subscriber.update(this, type));
  }

  enter() {
    if (!this.isFull()) {
      this.occupied++;
      this.notify('enter');
    } else {
      throw new Error(`the parking lot is full`);
    }
  }

  exit() {
    if (!this.isEmpty()) {
      this.occupied--;
      this.notify('exit');
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

export class Display implements Subscriber {
  update(lot: ParkingLot, type: 'enter' | 'exit'): void {
    const message =
      type === 'enter'
        ? `A car entered the lot ${lot.name}: ${lot.occupied}/${lot.capacity} occupied.`
        : `A car left the lot ${lot.name}: ${lot.occupied}/${lot.capacity} occupied.`;

    console.log(message);
  }
}