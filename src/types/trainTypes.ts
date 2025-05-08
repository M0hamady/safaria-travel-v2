// trainTypes.ts

// Station type
export interface Station {
    id: number | string;
    name: string;
  }
  
  // Location with stations
  export interface Location {
    id: number | string;
    name: string;
    stations: Station[];
    stations_count: number;
  }
  
  // Class (e.g. AC 2)
  export interface TrainClass {
    id: string;
    name: string;
    arDesc: string;
    enDesc: string;
    shortName: string;
    cost: number;
    availableSeatsCount: number;
  }
  
  // Train details
  export interface Train {
    id: string;
    workOrderId: string;
    name: string;
    classes: TrainClass[];
  }
  
  // Trip structure
  export interface Trip {
    id: number;
    station_from: Station;
    station_to: Station;
    start_time: string; // format: "YYYY-MM-DD HH:mm:ss"
    finish_time: string; // format: "YYYY-MM-DD"
    starting_price: number;
    duration: string; // format: "HH:mm"
    distance: string; // e.g. "203" kilometers
    train: Train;
    price: number;

  }
  