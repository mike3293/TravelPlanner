import { createDates, ServiceWithAuthBase } from '../serviceBase';
import { TripInfo } from './TripInfo';
import { TripCreate } from './TripCreate';



export class TripsService extends ServiceWithAuthBase {
    public async getTripsAsync() {
        return this.get<TripInfo[]>('trips', ts => ts.map(createDates));
    }

    public async createTripAsync(trip: TripCreate) {
        return this.post<TripInfo>('trips', trip, createDates);
    }
}
