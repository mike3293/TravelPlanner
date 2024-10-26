import { Duration } from 'moment';


export interface TripDayActivity {
    readonly id: string;
    readonly address: string;
    readonly latitude: number;
    readonly longitude: number;
    readonly name: string | null;
    readonly description: string | null;
    readonly imageUrl: string | null;
    readonly duration: Duration | null;
}