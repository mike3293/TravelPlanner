import { Card, CardContent, Typography } from '@mui/material';
import { ReactNode } from 'react';

import { DateFormat } from 'src/config/dateFormats';
import { TripDay } from 'src/services/trips/TripDay';

import styles from './TripDayContainer.module.scss';


export interface TripDayContainerProps {
    day: TripDay;
    children?: ReactNode;
}

export function TripDayContainer({ day, children }: TripDayContainerProps) {
    return (
        <Card className={styles.day}>
            <CardContent className={styles.dayContent}>
                <div className={styles.dayHeader}>
                    <Typography variant='h6'>{day.date.format(DateFormat.Date)}</Typography>
                    {day.name && <Typography>{day.name}</Typography>}
                </div>
                {children}
            </CardContent>
        </Card>
    );
};
