import { Moment } from 'moment';
import { TripDayActivity } from './TripDayActivity';


export interface TripDay {
    id: string;
    date: Moment;
    name: string | null;
    activities: TripDayActivity[];
}