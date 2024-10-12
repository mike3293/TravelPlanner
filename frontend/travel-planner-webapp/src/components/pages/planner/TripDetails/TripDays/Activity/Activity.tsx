import { Card, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';
import { tripsService } from 'src/config/services';
import { useQuery } from 'src/components/hooks/useQuery';
import { Spinner } from 'src/components/atoms/Spinner';

import styles from './Activity.module.scss';
import { DateFormat } from 'src/config/dateFormats';
import { Moment } from 'moment';
import { TripDay } from 'src/services/trips/TripDay';
import { TripDayActivity } from 'src/services/trips/TripDayActivity';


export interface ActivityProps {
    activity: TripDayActivity;
    onDelete: () => void;
}

export function Activity({ activity, onDelete }: ActivityProps) {
    return (
        <div className={styles.activity}>
            <Typography>{activity.name}</Typography>
            <button
                type="button"
                onClick={onDelete}
            >
                X
            </button>
        </div>
    );
};
