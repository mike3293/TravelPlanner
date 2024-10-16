import { Button } from '@mui/material';
import L from 'leaflet';
import { useCallback, useMemo } from 'react';
import { Marker, useMap } from 'react-leaflet';
import classNames from 'classnames';

import useOnDidUpdate from 'src/components/hooks/useOnDidUpdate';
import { usePrevious } from 'src/components/hooks/usePrevious';
import { downloadFile } from 'src/components/utils/downloadFile';
import { generateKmzAsync } from 'src/components/utils/generateKmz';
import { getMarkerUrl } from 'src/components/utils/getMarkerUrl';
import { usePointsStoreShallow } from 'src/context/pointsStore';
import { useMobile } from 'src/components/hooks/useMedia';

import styles from './TravelDays.module.scss';


const getIcon = (iconUrl: string) => {
    return new L.Icon({
        iconUrl,
        iconSize: new L.Point(32, 32),
    });
}

export function TravelDays() {
    const isMobile = useMobile();

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
        if (isMobile) {
            map.setView([firstActivity.latitude, firstActivity.longitude], 6);
        } else {
            map.flyTo([firstActivity.latitude, firstActivity.longitude], 6);
        }
    }, [trip]);

    const markerPointGroups = useMemo(() => {
        return trip?.days.map((d, dInd) => ({
            day: d,
            activities: d.activities.map((a, aInd) => ({
                activity: a,
                iconUrl: getMarkerUrl(dInd, aInd),
            })),
        })) ?? [];
    }, [trip]);

    const exportKmz = useCallback(async () => {
        const kmz = await generateKmzAsync(markerPointGroups);
        downloadFile(`${trip?.name}.kmz`, kmz);
    }, [markerPointGroups, trip?.name]);

    return (
        <>
            <Button
                className={classNames(styles.exportButton, isMobile && styles.exportButtonMobile)}
                variant='contained'
                onClick={exportKmz}
                disabled={markerPointGroups.length === 0}
            >
                Export KMZ
            </Button>
            {markerPointGroups.flatMap(g => g.activities).map(({ activity, iconUrl }) => (
                <Marker
                    key={activity.id}
                    position={[activity.latitude, activity.longitude]}
                    icon={getIcon(iconUrl)}
                />
            ))}
        </>
    );
};
