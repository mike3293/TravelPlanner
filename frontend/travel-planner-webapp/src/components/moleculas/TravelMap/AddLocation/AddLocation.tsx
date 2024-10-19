import { Marker, useMapEvents } from 'react-leaflet';

import { usePointSelectionStoreShallow } from 'src/context/pointSelectionStore';

import { PlaceSearch } from './PlaceSearch';
import { IntroStep, useIntroJourney } from '../../IntroJourney';


export function AddLocation() {
    const [
        isPointRequested,
        requestedPoint,
        updateRequestedPoint,
        updateRequestedPointAsync,
    ] = usePointSelectionStoreShallow(s => [
        s.isPointRequested,
        s.requestedPoint,
        s.updateRequestedPoint,
        s.updateRequestedPointAsync,
    ]);

    const { nextStep } = useIntroJourney();

    useMapEvents({
        click(event: L.LeafletMouseEvent) {
            if (isPointRequested && !requestedPoint) {
                updateRequestedPointAsync(event.latlng);
                nextStep();
            }
        }
    });

    if (!isPointRequested) {
        return null;
    }

    return (
        <>
            <div data-intro-step={IntroStep.AddPlaceMarker} />
            <PlaceSearch requestedPoint={requestedPoint} onSelect={updateRequestedPoint} />
            {requestedPoint && (
                <Marker
                    position={[requestedPoint.latitude, requestedPoint.longitude]}
                    draggable
                    eventHandlers={{
                        dragend: (event) => {
                            const latlng = event.target.getLatLng();

                            updateRequestedPointAsync(latlng);
                        },
                    }}
                />
            )}
        </>
    )
}
