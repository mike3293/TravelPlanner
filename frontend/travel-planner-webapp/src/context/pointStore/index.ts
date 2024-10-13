import { create } from 'zustand';
import { useShallow } from 'zustand/react/shallow';

import { IPointSelectionStore } from './types';


const usePointsStore = create<IPointSelectionStore>((set,) => ({
    days: [],
    setDays: (days) => set({ days }),
}));

export function usePointsStoreShallow<U>(selector: (store: IPointSelectionStore) => U): U {
    return usePointsStore(useShallow<IPointSelectionStore, U>(selector));
}