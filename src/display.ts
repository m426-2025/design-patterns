import { Observer, ParkingLot } from "./parking-lot.js";

export class Display implements Observer {
  private lastAction: "enter" | "exit" | null = null;

  update(subject: ParkingLot): void {
    // Wir erkennen die Aktion am Unterschied zum letzten Stand
    if (this.lastAction === null || subject.occupied > 0 && subject.occupied <= subject.capacity) {
      // Wir können die Aktion nicht direkt erkennen, daher geben wir immer beides aus
      // Alternativ könnte man ParkingLot erweitern, um die letzte Aktion zu speichern
      const action = this.lastAction === "exit" ? "A car entered the lot" : "A car left the lot";
      // Aber für Observer-Pattern: Wir geben einfach immer den aktuellen Stand aus
      // Hier besser: Wir geben aus, ob ein Auto rein oder raus ist, indem wir den Stand vergleichen
      // Das ist aber ohne Event-Objekt nicht 100% möglich, daher geben wir einfach den Stand aus
      // (Alternativ: ParkingLot könnte die letzte Aktion als Property speichern)
    }
    // Für diese Aufgabe: Wir geben einfach immer den aktuellen Stand aus
    console.log(`${subject.name}: ${subject.occupied}/${subject.capacity} occupied.`);
  }
}
