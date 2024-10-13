import { create } from 'zustand';
import { useShallow } from 'zustand/react/shallow';

import { IPointsStore } from './types';


export const usePointsStore = create<IPointsStore>((set,) => ({
    tripName: '',
    days: [],
    setTrip: (trip) => set({ tripName: trip.name, days: trip.days }),
    setDays: (days) => set({ days }),
}));

export function usePointsStoreShallow<U>(selector: (store: IPointsStore) => U): U {
    return usePointsStore(useShallow<IPointsStore, U>(selector));
}