import { Button, Card, CardContent, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

import styles from './Trips.module.scss';


export function Trips() {
    const trips = [{ id: 1, name: 'Japan Trip' }, { id: 2, name: 'Europe Trip' }];

    return (
        <div className={styles.tripList}>
            {trips.map(trip => (
                <Link key={trip.id} to={`/trips/${trip.id}`}>
                    <Card className={styles.card}>
                        <CardContent>
                            <Typography variant="h5">{trip.name}</Typography>
                        </CardContent>
                    </Card>
                </Link>
            ))}
            <Button variant="contained">Create New Trip</Button>
        </div>
    );
};
