import { forwardRef, useCallback, useState } from 'react';
import {
    MapContainer,
    Marker,
    useMapEvents,
} from 'react-leaflet';
import VectorTileLayer from 'react-leaflet-vector-tile-layer';
import L, { LatLng } from 'leaflet';

import constants from 'src/config/constants';
import { usePointSelectionStoreShallow } from 'src/context/pointSelectionStore';


L.Icon.Default.imagePath = `${window.location.origin}/images/leaflet/`;

const LocationMarker = ({ addLocation }: { addLocation: (latlng: LatLng) => void }) => {
    useMapEvents({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        click(event: any) {
            addLocation(event.latlng);
        }
    });

    return null;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function TravelMapInner(_: any, ref: React.Ref<L.Map>) {
    const [isPointRequested, confirmPointSelection] = usePointSelectionStoreShallow(s => [s.isPointRequested(), s.confirmPointSelection]);

    const [locations, setLocations] = useState<{ name: string; lat: number; lng: number }[]>([]);

    const handleAddLocation = useCallback((latlng: LatLng) => {
        const name = `Location ${locations.length + 1}`;
        const newLocation = { name, lat: latlng.lat, lng: latlng.lng };
        setLocations([...locations, newLocation]);
        confirmPointSelection(latlng);
    }, [locations]);

    return (
        <MapContainer ref={ref} center={[35.6586, 139.7454]} zoom={5} style={{ height: '100%', width: '100%' }}>
            <VectorTileLayer
                styleUrl={constants.VECTOR_MAP_STYLE_URL}
                attribution={constants.VECTOR_MAP_ATTRIBUTION}
            />
            {locations.map((location, index) => (
                <Marker key={index} position={[location.lat, location.lng]} />
            ))}
            {isPointRequested && (
                <LocationMarker addLocation={handleAddLocation} />
            )}
        </MapContainer>
    );
};

const TravelMap = forwardRef(TravelMapInner);
export { TravelMap };