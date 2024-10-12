import { createDates, ServiceWithAuthBase } from '../serviceBase';
import { TripInfo } from './TripInfo';
import { TripCreate } from './TripCreate';
import { Trip } from './Trip';


export class TripsService extends ServiceWithAuthBase {
    public async getTripsAsync() {
        return this.get<TripInfo[]>('trips', ts => ts.map(createDates));
    }

    public async getTripAsync(id: string) {
        return this.get<Trip>(`trips/${id}`, createDates);
    }

    public async createTripAsync(trip: TripCreate) {
        return this.post<TripInfo>('trips', trip, createDates);
    }
}
