export interface ParkingLotEvent {
    parkingLotName: string;
    occupied: number;
    capacity: number;
    type: 'enter' | 'exit';
  }
  