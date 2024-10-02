import { Typography } from '@mui/material';
import { useParams } from 'react-router-dom';

import styles from './TripDetails.module.scss';


export function TripDetails() {
    const { tripId } = useParams();

    return (
        <div className={styles.tripList}>
            <Typography variant="h5">{tripId}</Typography>
        </div>
    );
};
