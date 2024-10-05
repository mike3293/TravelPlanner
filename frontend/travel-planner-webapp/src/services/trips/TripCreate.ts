import { Moment } from 'moment';

export interface TripCreate {
    readonly name: string;
    readonly startDate: Moment;
    readonly endDate: Moment;
}