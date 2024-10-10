import { Typography } from '@mui/material';
import { useParams } from 'react-router-dom';

import styles from './TripDetails.module.scss';
import { useEffect } from 'react';
import { tripsService } from 'src/config/services';


export function TripDetails() {
    const { tripId } = useParams();

    useEffect(() => {
        tripsService.refreshSession();
    }, []);

    return (
        <div className={styles.tripList}>
            <Typography variant="h5">{tripId}!</Typography>
        </div>
    );
};
