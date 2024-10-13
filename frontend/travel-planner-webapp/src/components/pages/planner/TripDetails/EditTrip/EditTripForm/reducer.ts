import { Moment } from 'moment';

import { TripInfo } from 'src/services/trips/TripInfo';


export type TripAction =
    | { type: 'SET_TRIP_NAME'; payload: string }
    | { type: 'SET_START_DATE'; payload: Moment | null }
    | { type: 'SET_END_DATE'; payload: Moment | null };

export const tripReducer = (state: TripInfo, action: TripAction): TripInfo => {
    switch (action.type) {
        case 'SET_TRIP_NAME':
            return { ...state, name: action.payload };
        case 'SET_START_DATE':
            return { ...state, startDate: action.payload! };
        case 'SET_END_DATE':
            return { ...state, endDate: action.payload! };
        default:
            return state;
    }
};