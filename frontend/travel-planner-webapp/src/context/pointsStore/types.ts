import { Trip } from 'src/services/trips/Trip';
import { TripDay } from 'src/services/trips/TripDay';


export interface IPointsStore {
    trip: Trip | null;
    setTrip: (trip: Trip) => void;
    setDays: (days: TripDay[]) => void;
}
