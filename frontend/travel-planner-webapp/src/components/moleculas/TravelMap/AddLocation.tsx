import { Marker, useMapEvents } from 'react-leaflet';

import { usePointSelectionStoreShallow } from 'src/context/pointSelectionStore';


export function AddLocation() {
    const [
        isPointRequested,
        confirmPointSelection,
        requestedPoint,
        updateRequestedPointAsync,
    ] = usePointSelectionStoreShallow(s => [
        s.isPointRequested(),
        s.confirmPointSelection,
        s.requestedPoint,
        s.updateRequestedPointAsync,
    ]);

    useMapEvents({
        click(event: L.LeafletMouseEvent) {
            if (isPointRequested && !requestedPoint) {
                confirmPointSelection(event.latlng);
            }
        }
    });

    return requestedPoint && (
        <Marker
            position={[requestedPoint.latitude, requestedPoint.longitude]}
            draggable
            eventHandlers={{
                dragend: (event) => {
                    const latlng = event.target.getLatLng();

                    updateRequestedPointAsync(latlng);
                },
            }}
        />
    );
}
