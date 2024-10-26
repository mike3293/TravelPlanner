import { createDates, ServiceWithAuthBase } from '../serviceBase';
import { TripInfo } from './TripInfo';
import { TripUpdate } from './TripUpdate';
import { Trip } from './Trip';
import { TripDay } from './TripDay';
import { TripDayActivity } from './TripDayActivity';


export class TripsService extends ServiceWithAuthBase {
    public async getTripsAsync() {
        return this.get<TripInfo[]>('trips', ts => ts.map(createDates));
    }

    public async getTripAsync(id: string) {
        return this.get<Trip>(`trips/${id}`, createDates);
    }

    public async createTripAsync(trip: TripUpdate) {
        return this.post<TripInfo>('trips', trip, createDates);
    }

    public async updateTripAsync(id: string, trip: TripUpdate) {
        return this.put<Trip>(`trips/${id}`, trip, createDates);
    }

    public async updateTripDaysAsync(id: string, days: TripDay[]) {
        return this.put<Trip>(`trips/${id}/days`, days, createDates);
    }

    public async updateTripAccommodationsAsync(id: string, accommodations: TripDayActivity[]) {
        return this.put<Trip>(`trips/${id}/accommodations`, accommodations, createDates);
    }
}
