import { Card, CardContent, CardHeader, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';
import { tripsService } from 'src/config/services';
import { useQuery } from 'src/components/hooks/useQuery';
import { Spinner } from 'src/components/atoms/Spinner';

import styles from './TripDayContainer.module.scss';
import { DateFormat } from 'src/config/dateFormats';
import { Moment } from 'moment';
import { TripDay } from 'src/services/trips/TripDay';
import { TripDayActivity } from 'src/services/trips/TripDayActivity';
import { Activity } from '../Activity';
import { ReactNode } from 'react';


export interface TripDayContainerProps {
    day: TripDay;
    children?: ReactNode;
}

export function TripDayContainer({ day, children }: TripDayContainerProps) {
    console.log('day.date', day.date);
    console.log('day.date', day);
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
