import { Card, CardContent, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { TripInfo } from 'src/services/trips/TripInfo';

import styles from './TripItem.module.scss';
import { links } from 'src/links';
import { Moment } from 'moment';
import { DateFormat } from 'src/config/dateFormats';


interface TripItemProps {
    trip: TripInfo;
}

const renderDateField = (label: string, date: Moment) => (
    <>
        <Typography className={styles.fieldsLabel}>{label}:</Typography>
        <Typography>{date.format(DateFormat.Date)}</Typography>
    </>
);

export function TripItem({ trip: { id, name, startDate, endDate } }: TripItemProps) {


    return (
        <Link className={styles.link} to={links.tripDetails(id)}>
            <Card className={styles.card}>
                <CardContent className={styles.cardContent}>
                    <Typography variant='h5' gutterBottom>{name}</Typography>
                    <div className={styles.fields}>
                        {renderDateField('Start', startDate)}
                        {renderDateField('End', endDate)}
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
}