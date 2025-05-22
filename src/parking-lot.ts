/**
 * The Observer interface declares the update method, used by subjects.
 */
export interface Observer {
  update(subject: Subject): void;
}

/**
 * The Subject interface declares a set of methods for managing observers.
 */
export interface Subject {
  attach(observer: Observer): void;
  detach(observer: Observer): void;
  notify(): void;
}

export class ParkingLot implements Subject {
  public occupied: number = 0;
  private observers: Observer[] = [];

  constructor(
    public name: string,
    public capacity: number,
  ) {}

  attach(observer: Observer): void {
    if (!this.observers.includes(observer)) {
      this.observers.push(observer);
    }
  }

  detach(observer: Observer): void {
    const idx = this.observers.indexOf(observer);
    if (idx !== -1) {
      this.observers.splice(idx, 1);
    }
  }

  notify(): void {
    for (const observer of this.observers) {
      observer.update(this);
    }
  }

  enter() {
    if (!this.isFull()) {
      this.occupied++;
      this.notify();
    } else {
      throw new Error(`the parking lot is full`);
    }
  }

  exit() {
    if (!this.isEmpty()) {
      this.occupied--;
      this.notify();
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
