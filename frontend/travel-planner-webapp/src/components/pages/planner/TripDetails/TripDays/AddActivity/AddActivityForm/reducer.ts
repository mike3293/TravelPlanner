import { Duration } from 'moment';

import { PointWithAddress } from 'src/context/pointSelectionStore/types';
import { TripDayActivity } from 'src/services/trips/TripDayActivity';


export type Action =
    | { type: 'SET_NAME'; payload: string }
    | { type: 'SET_POINT'; payload: PointWithAddress }
    | { type: 'SET_DESCRIPTION'; payload: string | null }
    | { type: 'SET_IMAGE_URL'; payload: string | null }
    | { type: 'SET_DURATION'; payload: Duration | null }
    | { type: 'RESET'; payload?: never };

export const activityInitialState: TripDayActivity = {
    id: '',
    address: '',
    latitude: 0,
    longitude: 0,
    name: '',
    description: '',
    imageUrl: '',
    duration: null,
};

export const activityReducer = (state: TripDayActivity, { type, payload }: Action): TripDayActivity => {
    switch (type) {
        case 'SET_NAME':
            return { ...state, name: payload };
        case 'SET_POINT':
            return { ...state, ...payload };
        case 'SET_DESCRIPTION':
            return { ...state, description: payload };
        case 'SET_IMAGE_URL':
            return { ...state, imageUrl: payload };
        case 'SET_DURATION':
            return { ...state, duration: payload };
        case 'RESET':
            return { ...activityInitialState };
        default:
            return state;
    }
};