import { Card, CardContent, Typography } from '@mui/material';
import { ReactNode } from 'react';

import { getEmptyMarkerUrl } from 'src/components/utils/getMarkerUrl';
import { DateFormat } from 'src/config/dateFormats';
import { TripDay } from 'src/services/trips/TripDay';

import styles from './TripDayContainer.module.scss';


export interface TripDayContainerProps {
    day: TripDay;
    index: number;
    children?: ReactNode;
}

export function TripDayContainer({ day, index, children }: TripDayContainerProps) {
    return (
        <Card className={styles.day}>
            <CardContent className={styles.dayContent}>
                <div className={styles.dayHeader}>
                    <div className={styles.dayHeaderTitle}>
                        <Typography variant='h6'>{day.date.format(DateFormat.Date)}</Typography>
                        <img className={styles.dayHeaderTitleIcon} src={getEmptyMarkerUrl(index)} />
                    </div>
                    {day.name && <Typography>{day.name}</Typography>}
                </div>
                {children}
            </CardContent>
        </Card>
    );
};
