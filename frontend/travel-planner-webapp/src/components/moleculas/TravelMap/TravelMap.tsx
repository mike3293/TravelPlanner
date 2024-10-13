import L, { LatLng } from 'leaflet';
import { useRef } from 'react';
import {
    MapContainer,
    Marker,
    useMapEvents,
} from 'react-leaflet';
import VectorTileLayer from 'react-leaflet-vector-tile-layer';

import { useOnDidMount } from 'src/components/hooks/useOnDidMount';
import { mapResizeEventEmitter } from 'src/components/utils/events';
import constants from 'src/config/constants';
import { usePointSelectionStoreShallow } from 'src/context/pointSelectionStore';
import { usePointsStoreShallow } from 'src/context/pointStore';


L.Icon.Default.imagePath = `${window.location.origin}/images/leaflet/`;

const AddLocation = ({ addLocation }: { addLocation: (latlng: LatLng) => void }) => {
    useMapEvents({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        click(event: any) {
            addLocation(event.latlng);
        }
    });

    return null;
};

export function TravelMap() {
    const days = usePointsStoreShallow(s => s.days);
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

    const mapRef = useRef<L.Map>(null);

    useOnDidMount(() => {
        const handleResize = () => mapRef.current?.invalidateSize();
        mapResizeEventEmitter.subscribe(handleResize);

        return () => {
            mapResizeEventEmitter.unsubscribe(handleResize);
        };
    });

    return (
        <MapContainer ref={mapRef} center={[35.6586, 139.7454]} zoom={5} style={{ height: '100%', width: '100%' }}>
            <VectorTileLayer
                styleUrl={constants.VECTOR_MAP_STYLE_URL}
                attribution={constants.VECTOR_MAP_ATTRIBUTION}
            />
            {days.flatMap(d => d.activities).map(a => (
                <Marker key={a.id} position={[a.latitude, a.longitude]} />
            ))}
            {requestedPoint && (
                <Marker
                    position={[requestedPoint.latitude, requestedPoint.longitude]}
                    draggable
                    eventHandlers={{
                        dragend: (event) => {
                            console.debug(event);
                            console.debug(event.target);
                            const latlng = event.target.getLatLng();
                            console.debug(latlng);

                            updateRequestedPointAsync(latlng);
                        },
                    }}
                />
            )}
            {isPointRequested && (
                <AddLocation addLocation={confirmPointSelection} />
            )}
        </MapContainer>
    );
};
