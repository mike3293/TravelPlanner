import { Moment } from 'moment';


export interface TripUpdate {
    readonly name: string;
    readonly startDate: Moment;
    readonly endDate: Moment;
}