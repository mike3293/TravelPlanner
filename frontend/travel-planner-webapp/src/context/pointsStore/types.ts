import { Trip } from 'src/services/trips/Trip';
import { TripDay } from 'src/services/trips/TripDay';


export interface IPointsStore {
    tripName: string;
    days: TripDay[];
    setTrip: (trip: Trip) => void;
    setDays: (days: TripDay[]) => void;
}
