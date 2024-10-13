import { TripDay } from 'src/services/trips/TripDay';


export interface PointWithAddress {
    latitude: number;
    longitude: number;
    address: string;
}

export interface IPointSelectionStore {
    days: TripDay[];
    setDays: (days: TripDay[]) => void;
}
