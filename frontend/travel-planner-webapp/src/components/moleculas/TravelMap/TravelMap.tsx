import L from 'leaflet';
import { useRef } from 'react';
import { AttributionControl, MapContainer, ZoomControl } from 'react-leaflet';
import VectorTileLayer from 'react-leaflet-vector-tile-layer';

import { useMobile } from 'src/components/hooks/useMedia';
import { useOnDidMount } from 'src/components/hooks/useOnDidMount';
import { mapResizeEventEmitter } from 'src/components/utils/events';
import constants from 'src/config/constants';

import { AddLocation } from './AddLocation';
import { TravelDays } from './TravelDays';

import styles from './TravelMap.module.scss';


L.Icon.Default.imagePath = `${window.location.origin}/images/leaflet/`;

export function TravelMap() {
    const isMobile = useMobile();

    const mapRef = useRef<L.Map>(null);

    useOnDidMount(() => {
        const handleResize = () => mapRef.current?.invalidateSize();
        mapResizeEventEmitter.subscribe(handleResize);

        return () => {
            mapResizeEventEmitter.unsubscribe(handleResize);
        };
    });

    return (
        <MapContainer
            ref={mapRef}
            className={styles.map}
            // TODO: persist
            center={[35.6586, 139.7454]}
            zoom={3}
            zoomControl={false}
            attributionControl={false}
        >
            <VectorTileLayer
                styleUrl={constants.VECTOR_MAP_STYLE_URL}
                attribution={constants.VECTOR_MAP_ATTRIBUTION}
            />
            <AttributionControl position='bottomleft' />
            {!isMobile && <ZoomControl position='bottomright' />}
            <TravelDays />
            <AddLocation />
        </MapContainer>
    );
};
