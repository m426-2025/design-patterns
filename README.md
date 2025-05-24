# Entwurfsmuster (Design Patterns)

Der Seitenbereich [Design Patterns](https://refactoring.guru/design-patterns) von [refactoring.guru](https://refactoring.guru/) enthält hilfreiche Informationen zum Lösen der folgenden Aufgaben.

Erstelle einen Fork vom vorliegenden Repository und klone anschliessend diesen Fork. Installiere die Abhängigkeiten:

    npm install

Bearbeite dann die folgenden Aufgaben.

## Aufgabe 0: Geometry

Entwurfsmuster: [Adapter](https://refactoring.guru/design-patterns/adapter) (_structural_)

Hierbei handelt es sich um das Beispiel von den Folien, jedoch von C# auf TypeScript umgeschrieben.

Studiere den Code in den Dateien `src/geometry.ts`, `src/geometry.third-party.ts` und `src/geometry.test.ts`.

Erweitere anschliessend die Klasse `Calculator` um eine weitere Methode `getWidthHeightRatio(Rectangular)`, welche das Vehältnis der Breite zur Höhe des mitgegebenen rechteckigen Objekts berechnet. Bei Quadraten müsste das Verhältnis jeweils `1.0` betragen.

## Aufgabe 1: Parkhaussimulation

Entwurfsmuster: [Observer](https://refactoring.guru/design-patterns/observer) (_behavioral_)

In `src/parking-lot.ts` und `src/parking-lot.simulation.ts` ist eine Parkhaussimulation implementiert, die folgendermassen gestartet werden kann:

    npm run build && npm run parkinglot

Ein Parkhaus (`ParkingLot`) hat einen Namen (`name`), eine Kapazität (`capacity`) und einen Füllstand (`occupied`). Mithilfe der Methoden `enter()` und `exit()` kann ein Auto in das Parkhaus einfahren bzw. dieses verlassen.

In `parking-lot.simulation.ts` wird das Ein- und Ausfahren von Autos mit asynchronen Funktionen simuliert. Die Funktion `display` zeigt dabei mittels _Polling_ (Abfrage in regelmässigen Intervallen) den Füllstand an.

Bauen Sie die Simulation foldendermassen um:

1. Das Parkhaus soll als _Publisher_ agieren und seine _Subscriber_ jeweils informieren, wenn ein Auto in das Parkhaus einfährt oder es verlässt.
   - Erstellen Sie hierzu zwei Interfaces `Publisher` und `Subscriber` mit den entsprechenden Methoden.
2. Eine neue Klasse namens `Display` soll als _Subscriber_ agieren, welcher über ein- und ausfahrende Autos des Parkhauses informiert wird.
3. Überlegen Sie sich, ob die Ereignisse als eine Reihe von Variablen (Name des Parkhauses, Füllstand usw.) übermittelt werden sollen, oder ob hier ein spezielles `Event`-Objekt hilfreich wäre.
4. Ein- und ausfahrende Autos einerseits und der Füllstand des Parkhauses andererseits sollen nicht mehr in getrennten Meldungen ausgegeben werden, sondern zusammen als eine Meldung:

Alt:

    A car entered the lot Bahnhof Parking.
    Bahnhof Parking: 3/100 occupied
    Bahnhof Parking: 3/100 occupied
    Bahnhof Parking: 3/100 occupied
    A car left the lot Bahnhof Parking.
    Bahnhof Parking: 2/100 occupied
    Bahnhof Parking: 2/100 occupied

Neu:

    A car entered the lot Bahnhof Parking: 3/100 occupied.
    A car left the lot Bahnhof Parking: 2/100 occupied.

Diese kompakte Ausgabe ist nur möglich, wenn auf Polling (d.h. Anfragen in
bestimmten Intervallen) verzichtet wird und man stattdessen einen Mechanismus
wie einen Observer verwendet.

## Aufgabe 2: Texteditor

Entwurfsmuster: [State](https://refactoring.guru/design-patterns/state)

In `src/text-editor.ts` und in [`dist/index.html`](dist/index.html) ist ein Text-Editor implementiert, der Texteingaben als Pseudo-Dateien im `localStorage` des Browsers ablegt.

Ein Text kann entweder einem Dateinamen zugeordnet sein ("saved") oder nicht ("unsaved"). Gegenüber der letzten Speicherung kann der Text eine Änderung erfahren haben ("dirty") oder keine Veränderung haben ("clean"). Aus diesen beiden Aspekten ergeben sich folgende Zustände, die in der `enum State` definiert sind:

- `CleanUnsaved`: keine Veränderung, kein Dateiname vorhanden
- `CleanSaved`: keine Veränderung, Dateiname vorhanden
- `DirtyUnsaved`: mit Veränderung, kein Dateiname vorhanden
- `DirtySaved`: mit Veränderung, Dateiname vorhanden

Mit der Variable `state` wird der jeweilige Zustand des Editors festgehalten. Verschiedene Stellen im Code reagieren unterschiedlich auf diesen Zustand. Beispiel: Bei `*Unsaved`-Zuständen muss beim Betätigen der `Save`-Schaltfläche ein Dateiname angegeben werden, bei `*Saved`-Zuständen hingegen wird der zuletzt verwendete Dateinamen verwendet.

Verbessere den Quellcode, indem du das Sate-Entwurfsmuster implementierst. Aus der `enum State` wird ein Interface, das durch die vier bereits bekannten Zuständen als Klassen implementiert wird. Die zustandsabhängigen Daten (z.B. der Dateiname) sollen dann Teil der jeweiligen Zustands-Instanz sein, und nicht mehr im Editor-Code als globale Variablen herumliegen.

**Wichtig**: Der Code muss zu Beginn und nach jeder Änderung kompiliert werden:

    npm run build
