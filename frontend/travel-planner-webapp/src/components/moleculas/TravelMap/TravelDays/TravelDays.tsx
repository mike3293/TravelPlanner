import L from 'leaflet';
import { useMemo } from 'react';
import { Marker, useMap } from 'react-leaflet';

import { useMobile } from 'src/components/hooks/useMedia';
import useOnDidUpdate from 'src/components/hooks/useOnDidUpdate';
import { usePrevious } from 'src/components/hooks/usePrevious';
import { getAccomodationMarkerUrl, getMarkerUrl } from 'src/components/utils/getMarkerUrl';
import { usePointsStoreShallow } from 'src/context/pointsStore';
import { DateFormat } from 'src/config/dateFormats';

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
        if (!trip) return [];

        return [
            ...trip.accommodations.map((a) => ({
                title: 'Accommodations',
                activities: [{
                    activity: a,
                    iconUrl: getAccomodationMarkerUrl(),
                }],
            })),
            ...trip.days.map((d, dInd) => ({
                title: `${d.date.format(DateFormat.DateWithWeekDay)}${d.name ? ` (${d.name})` : ''}`,
                activities: d.activities.map((a, aInd) => ({
                    activity: a,
                    iconUrl: getMarkerUrl(dInd, aInd),
                })),
            })),
        ];
    }, [trip]);

    return (
        <>
            <ExportKmz
                tripName={trip?.name}
                markerPointGroups={markerPointGroups}
            />
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
