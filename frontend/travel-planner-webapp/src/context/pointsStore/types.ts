import { Trip } from 'src/services/trips/Trip';
import { TripDay } from 'src/services/trips/TripDay';
import { TripDayActivity } from 'src/services/trips/TripDayActivity';


export interface IPointsStore {
    trip: Trip | null;
    setTrip: (trip: Trip | null) => void;
    setDays: (days: TripDay[]) => void;
    setAccommodations: (accommodations: TripDayActivity[]) => void;
}
