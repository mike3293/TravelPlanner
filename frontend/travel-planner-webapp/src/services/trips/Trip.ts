import { TripInfo } from './TripInfo';
import { TripDay } from './TripDay';
import { TripDayActivity } from './TripDayActivity';


export interface Trip extends TripInfo {
    readonly days: TripDay[];
    readonly accommodations: TripDayActivity[];
}