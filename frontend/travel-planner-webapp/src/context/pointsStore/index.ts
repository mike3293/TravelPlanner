import { create } from 'zustand';
import { useShallow } from 'zustand/react/shallow';

import { IPointsStore } from './types';


export const usePointsStore = create<IPointsStore>((set, get) => ({
    trip: null,
    setTrip: (trip) => set({ trip }),
    setDays: (days) => set({ trip: { ...get().trip!, days } }),
}));

export function usePointsStoreShallow<U>(selector: (store: IPointsStore) => U): U {
    return usePointsStore(useShallow<IPointsStore, U>(selector));
}