import { Moment } from 'moment';

import { TripInfo } from './TripInfo';
import { TripDay } from './TripDay';


export interface Trip extends TripInfo {
    readonly id: string;
    readonly name: string;
    readonly startDate: Moment;
    readonly endDate: Moment;
    readonly days: TripDay[];
}