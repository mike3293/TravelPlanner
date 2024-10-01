import { ServiceWithAuthBase } from '../serviceBase';

export class TripsService extends ServiceWithAuthBase {
    public async getTripsAsync(): Promise<any> {
        return this.get(`trips`);
    }
}
