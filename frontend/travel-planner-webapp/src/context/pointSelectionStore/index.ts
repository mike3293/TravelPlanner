import { create } from 'zustand';
import { useShallow } from 'zustand/react/shallow';

import { geocodingService } from 'src/config/services';

import { IPointSelectionStore, PointWithAddress } from './types';


const allowedTypes = ['street_address', 'route'];

const getPointWithAddressAsync = async (point: L.LatLng): Promise<PointWithAddress> => {
    const locationResult = await geocodingService.getAddressAsync(point.lat, point.lng);
    // if (!locationResult.isSuccessful) {
    //     throw new Error(locationResult.error);
    // }
    const address = locationResult.results.filter(r => r.types.some(t => allowedTypes.includes(t)))[0]?.formatted_address;
    if (!address) {
        throw new Error('No address in response for the selected location.');
    }

    const pointWithAddress = { latitude: point.lat, longitude: point.lng, address };

    return pointWithAddress;
}

const usePointSelectionStore = create<IPointSelectionStore>((set, get) => ({
    pointRequestPromise: null,
    requestedPoint: null,
    isPointRequested: () => {
        const { pointRequestPromise, requestedPoint } = get();
        return pointRequestPromise !== null || requestedPoint !== null;
    },
    requestPointSelectionAsync: () => {
        const { isPointRequested } = get();

        if (isPointRequested()) {
            throw new Error('Point selection is already in progress. Please confirm or cancel the current selection.');
        }

        return new Promise((resolve) => {
            set({
                pointRequestPromise: new Promise((innerResolve) => {
                    innerResolve(async (point) => {
                        const requestedPoint = await getPointWithAddressAsync(point);

                        set({ requestedPoint });
                        resolve(requestedPoint);
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
    updateRequestedPointAsync: async (point) => {
        const requestedPoint = await getPointWithAddressAsync(point);

        set({ requestedPoint });
    },
    clearRequestedPoint: () => {
        set({ requestedPoint: null, pointRequestPromise: null });
    },
}));

export function usePointSelectionStoreShallow<U>(selector: (store: IPointSelectionStore) => U): U {
    return usePointSelectionStore(useShallow<IPointSelectionStore, U>(selector));
}