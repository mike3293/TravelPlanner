import L from 'leaflet';
import { Marker } from 'react-leaflet';

import { usePointsStoreShallow } from 'src/context/pointStore';


const icon = new L.Icon({
    iconUrl: `${window.location.origin}/images/markers/number-15.png`,
    iconSize: new L.Point(25, 25),
    // className: 'leaflet-div-icon'
});


export function TravelDays() {
    const days = usePointsStoreShallow(s => s.days);

    return (
        <>
            {days.flatMap(d => d.activities).map(a => (
                <Marker
                    key={a.id}
                    position={[a.latitude, a.longitude]}
                    icon={icon}
                />
            ))}
        </>
    );
};
