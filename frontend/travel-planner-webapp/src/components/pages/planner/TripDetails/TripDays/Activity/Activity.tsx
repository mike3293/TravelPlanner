import { IconButton, Typography } from '@mui/material';
import { HighlightOff } from '@mui/icons-material';

import { TripDayActivity } from 'src/services/trips/TripDayActivity';

import styles from './Activity.module.scss';


export interface ActivityProps {
    activity: TripDayActivity;
    onDelete: () => void;
}

export function Activity({ activity, onDelete }: ActivityProps) {
    return (
        <div className={styles.activity}>
            <Typography>{activity.name}</Typography>
            <IconButton
                className={styles.activityDelete}
                onClick={onDelete}
            >
                <HighlightOff />
            </IconButton>
        </div>
    );
};
