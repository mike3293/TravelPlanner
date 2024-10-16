import { create } from 'zustand';
import { useShallow } from 'zustand/react/shallow';

import { geocodingService } from 'src/config/services';

import { IPointSelectionStore, PointWithAddress } from './types';


const prefferedTypes = ['street_address', 'route'];
const getAddressFromResult = (results: google.maps.GeocoderResult[]) => {
    if (!results.length) {
        return null;
    }

    const result = prefferedTypes
        .map(type => results.find(r => r.types.includes(type)))
        .find(r => r) ?? results[0];
    const address = result?.formatted_address;

    return address;
}

const getPointWithAddressAsync = async (point: L.LatLng): Promise<PointWithAddress> => {
    const locationResult = await geocodingService.getAddressAsync(point.lat, point.lng);
    if (!locationResult.isSuccessful) {
        throw new Error(locationResult.error);
    }

    const address = getAddressFromResult(locationResult.result.results);
    if (!address) {
        throw new Error('No address in response for the selected location.');
    }

    const pointWithAddress = { latitude: point.lat, longitude: point.lng, address };

    return pointWithAddress;
}

const usePointSelectionStore = create<IPointSelectionStore>((set, get) => ({
    isPointRequested: false,
    requestedPoint: null,
    requestPointSelection: (requestedPoint) => {
        const { isPointRequested } = get();

        if (isPointRequested) {
            throw new Error('Point selection is already in progress. Please confirm or cancel the current selection.');
        }

        // const requestedPoint = await getPointWithAddressAsync(point);
        set({ isPointRequested: true, requestedPoint });
    },
    updateRequestedPoint: (requestedPoint) => {
        set({ requestedPoint });
    },
    updateRequestedPointAsync: async (point) => {
        const requestedPoint = await getPointWithAddressAsync(point);

        set({ requestedPoint });
    },
    confirmPointSelection: () => {
        set({ requestedPoint: null, isPointRequested: false });
    },
}));

export function usePointSelectionStoreShallow<U>(selector: (store: IPointSelectionStore) => U): U {
    return usePointSelectionStore(useShallow<IPointSelectionStore, U>(selector));
}