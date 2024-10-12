import { Typography } from '@mui/material';
import { useParams } from 'react-router-dom';
import { tripsService } from 'src/config/services';
import { useQuery } from 'src/components/hooks/useQuery';
import { Spinner } from 'src/components/atoms/Spinner';

import styles from './TripDetails.module.scss';
import { DateFormat } from 'src/config/dateFormats';
import { Moment } from 'moment';
import { useCallback } from 'react';
import { useQueryClient } from 'react-query';
import { Trip } from 'src/services/trips/Trip';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { TripDays } from './TripDays';

const renderDateField = (label: string, date: Moment) => (
    <div className={styles.fieldsField}>
        <Typography className={styles.fieldsLabel}>{label}:</Typography>
        <Typography>{date.format(DateFormat.Date)}</Typography>
    </div>
);



export function TripDetails() {
    const { tripId } = useParams();

    const queryClient = useQueryClient();

    // useQuery with trip details
    const { data, error, isLoading } = useQuery(
        ['trip', tripId],
        () => tripsService.getTripAsync(tripId!),
    );

    if (isLoading) return <Spinner />;
    if (error) return <Typography>{error}</Typography>;

    if (!data) return null;

    return (
        <div className={styles.trip}>
            <div className={styles.tripHeader}>
                <Typography variant='h4'>{data.name}</Typography>
                <div className={styles.fields}>
                    {renderDateField('Start', data.startDate)}
                    {renderDateField('End', data.endDate)}
                </div>
            </div>
            <TripDays
                days={data.days}
                setDays={(days) => {
                    queryClient.setQueryData(['trip', tripId], {
                        ...data,
                        days,
                    });
                }}
            />
        </div>
    );
};
