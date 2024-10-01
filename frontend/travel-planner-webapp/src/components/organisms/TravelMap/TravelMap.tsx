import { useState } from 'react';
import {
    MapContainer,
    Marker,
    useMapEvents,
} from 'react-leaflet';
import VectorTileLayer from 'react-leaflet-vector-tile-layer';
import L, { LatLng } from 'leaflet';
import constants from 'src/config/constants';

L.Icon.Default.imagePath = 'images/leaflet/';

const LocationMarker = ({ addLocation }: { addLocation: (latlng: LatLng) => void }) => {
    useMapEvents({
        click(event: any) {
            addLocation(event.latlng);
        },
    });

    return null;
};

export function TravelMap() {
    const [locations, setLocations] = useState<{ name: string; lat: number; lng: number }[]>([]);

    const handleAddLocation = (latlng: LatLng) => {
        const name = `Location ${locations.length + 1}`;
        const newLocation = { name, lat: latlng.lat, lng: latlng.lng };
        setLocations([...locations, newLocation]);
    };

    return (
        <MapContainer center={[35.6586, 139.7454]} zoom={5} style={{ height: '500px', width: '1000px' }}>
            <VectorTileLayer
                styleUrl={constants.VECTOR_MAP_STYLE_URL}
                attribution={constants.VECTOR_MAP_ATTRIBUTION}
            />
            {locations.map((location, index) => (
                <Marker key={index} position={[location.lat, location.lng]} />
            ))}
            <LocationMarker addLocation={handleAddLocation} />
        </MapContainer>
    );
};
