import { Moment } from 'moment';

export interface TripInfo {
    readonly id: string;
    readonly name: string;
    readonly startDate: Moment;
    readonly endDate: Moment;
}