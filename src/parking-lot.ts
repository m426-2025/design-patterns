export interface ParkingEvent {
  type: 'enter' | 'exit';
  lotName: string;
  occupied: number;
  capacity: number;
  timestamp: Date;
}

export interface Subscriber {
  update(event: ParkingEvent): void;
}

export interface Publisher {
  subscribe(subscriber: Subscriber): void;
  unsubscribe(subscriber: Subscriber): void;
  notifySubscribers(event: ParkingEvent): void;
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
    this.subscribers = this.subscribers.filter(sub => sub !== subscriber);
  }

  notifySubscribers(event: ParkingEvent): void {
    for (const subscriber of this.subscribers) {
      subscriber.update(event);
    }
  }

  enter() {
    if (!this.isFull()) {
      this.occupied++;
      this.notifySubscribers({
        type: 'enter',
        lotName: this.name,
        occupied: this.occupied,
        capacity: this.capacity,
        timestamp: new Date(),
      });
    } else {
      throw new Error(`The parking lot ${this.name} is full`);
    }
  }

  exit() {
    if (!this.isEmpty()) {
      this.occupied--;
      this.notifySubscribers({
        type: 'exit',
        lotName: this.name,
        occupied: this.occupied,
        capacity: this.capacity,
        timestamp: new Date(),
      });
    } else {
      throw new Error(`The parking lot ${this.name} is empty`);
    }
  }

  isFull(): boolean {
    return this.occupied === this.capacity;
  }

  isEmpty(): boolean {
    return this.occupied === 0;
  }
}

export class Display implements Subscriber {
  constructor(private displayName: string) {}
  update(event: ParkingEvent): void {
    const actionText = event.type === 'enter' ? 'entered' : 'left';
    console.log(
      `[${this.displayName}] A car ${actionText} the lot ${event.lotName}: ${event.occupied}/${event.capacity} occupied. (${event.timestamp.toLocaleTimeString()})`
    );
  }
}