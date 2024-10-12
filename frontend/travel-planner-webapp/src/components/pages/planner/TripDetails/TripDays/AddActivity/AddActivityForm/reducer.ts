import { Moment } from 'moment';


export interface TripState {
    tripName: string;
    startDate: Moment | null;
    endDate: Moment | null;
}

export type TripAction =
    | { type: 'SET_TRIP_NAME'; payload: string }
    | { type: 'SET_START_DATE'; payload: Moment | null }
    | { type: 'SET_END_DATE'; payload: Moment | null };

export const tripInitialState: TripState = {
    tripName: '',
    startDate: null,
    endDate: null,
};

export const tripReducer = (state: TripState, action: TripAction): TripState => {
    switch (action.type) {
        case 'SET_TRIP_NAME':
            return { ...state, tripName: action.payload };
        case 'SET_START_DATE':
            return { ...state, startDate: action.payload };
        case 'SET_END_DATE':
            return { ...state, endDate: action.payload };
        default:
            return state;
    }
};