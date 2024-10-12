import { TripDay } from 'src/services/trips/TripDay';


export interface PointWithAddress {
    latitude: number;
    longitude: number;
    address: string;
}

export interface IPointSelectionStore {
    days: TripDay[];
    isPointRequested: () => boolean;
    pointRequestPromise: Promise<IPointSelectionStore['confirmPointSelection']> | null;
    requestPointSelectionAsync: () => Promise<PointWithAddress>;
    confirmPointSelection: (point: L.LatLng) => void;
}
