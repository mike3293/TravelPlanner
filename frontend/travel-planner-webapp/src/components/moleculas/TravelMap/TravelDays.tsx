import { Button } from '@mui/material';
import L from 'leaflet';
import { useCallback, useMemo } from 'react';
import { Marker } from 'react-leaflet';

import { downloadFile } from 'src/components/utils/downloadFile';
import { generateKmzAsync } from 'src/components/utils/generateKmz';
import { getMarkerUrl } from 'src/components/utils/getMarkerUrl';
import { usePointsStoreShallow } from 'src/context/pointsStore';


const getIcon = (iconUrl: string) => {
    return new L.Icon({
        iconUrl,
        iconSize: new L.Point(32, 32),
    });
}

export function TravelDays() {
    const [trip] = usePointsStoreShallow(s => [s.trip]);

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
                sx={{ position: 'absolute', right: 10, top: 10, zIndex: 1000 }}
                variant='contained'
                onClick={exportKmz}
                disabled={markerPoints.length === 0}
            >
                Export
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
