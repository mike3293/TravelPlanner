import { IconButton, Typography } from '@mui/material';
import { HighlightOff } from '@mui/icons-material';

import { TripDayActivity } from 'src/services/trips/TripDayActivity';
import { IntroStep } from 'src/components/moleculas/IntroJourney';
import { getMarkerUrl } from 'src/components/utils/getMarkerUrl';

import { EditActivity } from './EditActivity';

import styles from './Activity.module.scss';


export interface ActivityProps {
    activity: TripDayActivity;
    indexes?: {
        dayIndex: number;
        index: number;
    }
    onEdit: (activity: TripDayActivity) => void;
    onDelete: () => void;
}

export function Activity({ activity, indexes, onEdit, onDelete }: ActivityProps) {
    return (
        <div
            className={styles.activity}
            data-intro-step={IntroStep.ActivityActionDetails}
        >
            {indexes && (
                <img className={styles.activityIcon} src={getMarkerUrl(indexes.dayIndex, indexes.index)} />
            )}
            <Typography>{activity.name}</Typography>
            <div className={styles.activityActions}>
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
