import { ReactNode } from 'react';

import { getEmptyMarkerUrl } from 'src/components/utils/getMarkerUrl';
import { DateFormat } from 'src/config/dateFormats';
import { TripDay } from 'src/services/trips/TripDay';

import { CardContainer } from '../components/CardContainer';


export interface TripDayContainerProps {
    day: TripDay;
    index: number;
    children?: ReactNode;
}

export function TripDayContainer({ day, index, children }: TripDayContainerProps) {
    return (
        <CardContainer
            title={day.date.format(DateFormat.DateWithWeekDay)}
            name={day.name}
            markerUrl={getEmptyMarkerUrl(index)}
        >
            {children}
        </CardContainer>
    )
};
