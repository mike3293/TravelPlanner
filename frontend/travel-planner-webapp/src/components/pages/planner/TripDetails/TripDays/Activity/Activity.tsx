import { IconButton, Typography } from '@mui/material';
import { HighlightOff } from '@mui/icons-material';

import { TripDayActivity } from 'src/services/trips/TripDayActivity';
import { IntroStep } from 'src/components/moleculas/IntroJourney';

import { EditActivity } from './EditActivity';

import styles from './Activity.module.scss';


export interface ActivityProps {
    activity: TripDayActivity;
    onEdit: (activity: TripDayActivity) => void;
    onDelete: () => void;
}

export function Activity({ activity, onEdit, onDelete }: ActivityProps) {
    return (
        <div
            className={styles.activity}
            data-intro-step={IntroStep.ActivityActionDetails}
        >
            <Typography>{activity.name}</Typography>
            <div>
                <EditActivity
                    className={styles.activityEdit}
                    activity={activity}
                    onEdit={onEdit}
                />
                <IconButton
                    className={styles.activityDelete}
                    onClick={onDelete}
                >
                    <HighlightOff />
                </IconButton>
            </div>
        </div>
    );
};
