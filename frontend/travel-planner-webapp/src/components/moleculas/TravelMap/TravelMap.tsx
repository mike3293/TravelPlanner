import L from 'leaflet';
import { useRef } from 'react';
import { MapContainer } from 'react-leaflet';
import VectorTileLayer from 'react-leaflet-vector-tile-layer';

import { useOnDidMount } from 'src/components/hooks/useOnDidMount';
import { mapResizeEventEmitter } from 'src/components/utils/events';
import constants from 'src/config/constants';

import { AddLocation } from './AddLocation';
import { TravelDays } from './TravelDays';


L.Icon.Default.imagePath = `${window.location.origin}/images/leaflet/`;

export function TravelMap() {
    const mapRef = useRef<L.Map>(null);

    useOnDidMount(() => {
        const handleResize = () => mapRef.current?.invalidateSize();
        mapResizeEventEmitter.subscribe(handleResize);

        return () => {
            mapResizeEventEmitter.unsubscribe(handleResize);
        };
    });

    return (
        <MapContainer ref={mapRef} center={[35.6586, 139.7454]} zoom={3} style={{ height: '100%', width: '100%' }}>
            <VectorTileLayer
                styleUrl={constants.VECTOR_MAP_STYLE_URL}
                attribution={constants.VECTOR_MAP_ATTRIBUTION}
            />
            <TravelDays />
            <AddLocation />
        </MapContainer>
    );
};
