import { Duration } from 'moment';


export interface TripDayActivity {
    id: string;
    address: string;
    latitude: number;
    longitude: number;
    name: string | null;
    description: string | null;
    imageUrl: string | null;
    duration: Duration | null;
}