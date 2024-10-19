import L from 'leaflet';
import { useMemo } from 'react';
import { Marker, useMap } from 'react-leaflet';

import { useMobile } from 'src/components/hooks/useMedia';
import useOnDidUpdate from 'src/components/hooks/useOnDidUpdate';
import { usePrevious } from 'src/components/hooks/usePrevious';
import { getMarkerUrl } from 'src/components/utils/getMarkerUrl';
import { usePointsStoreShallow } from 'src/context/pointsStore';

import { ExportKmz } from './ExportKmz';


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

    return (
        <>
            {trip && (
                <ExportKmz
                    tripName={trip.name}
                    markerPointGroups={markerPointGroups}
                />
            )}
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
