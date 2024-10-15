import { Marker, useMapEvents } from 'react-leaflet';

import { usePointSelectionStoreShallow } from 'src/context/pointSelectionStore';

import { PlaceSearch } from './PlaceSearch';


export function AddLocation() {
    const [
        isPointRequested,
        requestedPoint,
        updateRequestedPoint,
        updateRequestedPointAsync,
    ] = usePointSelectionStoreShallow(s => [
        s.isPointRequested,
        s.requestedPoint,
        s.updateRequestedPoint,
        s.updateRequestedPointAsync,
    ]);

    useMapEvents({
        click(event: L.LeafletMouseEvent) {
            if (isPointRequested && !requestedPoint) {
                updateRequestedPointAsync(event.latlng);
            }
        }
    });

    if (!isPointRequested) {
        return null;
    }

    return (
        <>
            <PlaceSearch requestedPoint={requestedPoint} onSelect={updateRequestedPoint} />
            {requestedPoint && (
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
            )}
        </>
    )
}
