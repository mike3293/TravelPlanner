export interface PointWithAddress {
    latitude: number;
    longitude: number;
    address: string;
}

export interface IPointSelectionStore {
    isPointRequested: boolean;
    requestedPoint: PointWithAddress | null;
    requestPointSelection: (point?: PointWithAddress) => void;
    updateRequestedPoint: (point: PointWithAddress) => void;
    updateRequestedPointAsync: (point: L.LatLng) => void;
    confirmPointSelection: () => void;
}
