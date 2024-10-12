export interface PointWithAddress {
    latitude: number;
    longitude: number;
    address: string;
}

export interface IPointSelectionStore {
    pointRequestPromise: Promise<IPointSelectionStore['confirmPointSelection']> | null;
    requestedPoint: PointWithAddress | null;
    isPointRequested: () => boolean;
    requestPointSelectionAsync: () => Promise<PointWithAddress>;
    confirmPointSelection: (point: L.LatLng) => void;
    updateRequestedPointAsync: (point: L.LatLng) => void;
    clearRequestedPoint: () => void;
}
