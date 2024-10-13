import { Button } from '@mui/material';
import L from 'leaflet';
import { useCallback, useMemo } from 'react';
import { Marker, useMap } from 'react-leaflet';

import useOnDidUpdate from 'src/components/hooks/useOnDidUpdate';
import { usePrevious } from 'src/components/hooks/usePrevious';
import { downloadFile } from 'src/components/utils/downloadFile';
import { generateKmzAsync } from 'src/components/utils/generateKmz';
import { getMarkerUrl } from 'src/components/utils/getMarkerUrl';
import { usePointsStoreShallow } from 'src/context/pointsStore';

import styles from './TravelDays.module.scss';


const getIcon = (iconUrl: string) => {
    return new L.Icon({
        iconUrl,
        iconSize: new L.Point(32, 32),
    });
}

export function TravelDays() {
    const map = useMap();

    const [trip] = usePointsStoreShallow(s => [s.trip]);

    const prevTripId = usePrevious(trip?.id);

    useOnDidUpdate(() => {
        if (!trip || trip.id === prevTripId) {
            return;
        }
        const firstActivity = trip.days.find(d => d.activities.length !== 0)?.activities[0];
        if (!firstActivity) {
            return;
        }
        map.flyTo([firstActivity.latitude, firstActivity.longitude], 6);
    }, [trip]);

    const markerPoints = useMemo(() => {
        return trip?.days.flatMap((d, dInd) => d.activities.map((a, aInd) => ({
            activity: a,
            iconUrl: getMarkerUrl(dInd, aInd),
        }))) ?? [];
    }, [trip]);

    const exportKmz = useCallback(async () => {
        const kmz = await generateKmzAsync(markerPoints);
        downloadFile(`${trip?.name}.kmz`, kmz);
    }, [markerPoints, trip?.name]);

    return (
        <>
            <Button
                className={styles.exportButton}
                variant='contained'
                onClick={exportKmz}
                disabled={markerPoints.length === 0}
            >
                Export KMZ
            </Button>
            {markerPoints.map(({ activity, iconUrl }) => (
                <Marker
                    key={activity.id}
                    position={[activity.latitude, activity.longitude]}
                    icon={getIcon(iconUrl)}
                />
            ))}
        </>
    );
};
