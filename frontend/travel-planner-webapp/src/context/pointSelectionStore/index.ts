import { create } from 'zustand';
import { useShallow } from 'zustand/react/shallow';

import { geocodingService } from 'src/config/services';

import { IPointSelectionStore } from './types';


const getAddressAsync = async (point: L.LatLng) => {
    const locationResult = await geocodingService.getAddressAsync(point.lat, point.lng);
    if (!locationResult.isSuccessful) {
        throw new Error(locationResult.error);
    }
    const address = locationResult.result.results[0]?.formatted_address;
    if (!address) {
        throw new Error('No address in response for the selected location.');
    }

    return address;
}

const usePointSelectionStore = create<IPointSelectionStore>((set, get) => ({
    days: [],
    pointRequestPromise: null,
    isPointRequested: () => get().pointRequestPromise !== null,
    requestPointSelectionAsync: () => {
        const { pointRequestPromise } = get();

        if (pointRequestPromise) {
            throw new Error('Point selection is already in progress. Please confirm or cancel the current selection.');
        }

        return new Promise((resolve) => {
            set({
                pointRequestPromise: new Promise((innerResolve) => {
                    innerResolve(async (point) => {
                        const address = await getAddressAsync(point);

                        return resolve({ latitude: point.lat, longitude: point.lng, address });
                    });
                }),
            });
        });
    },
    confirmPointSelection: async (point) => {
        const { pointRequestPromise } = get();

        if (!pointRequestPromise) {
            throw new Error('No point selection is in progress.');
        }

        pointRequestPromise.then((resolver) => {
            resolver(point);
            set({ pointRequestPromise: null });
        });
    },
}));

export function usePointSelectionStoreShallow<U>(selector: (store: IPointSelectionStore) => U): U {
    return usePointSelectionStore(useShallow<IPointSelectionStore, U>(selector));
}