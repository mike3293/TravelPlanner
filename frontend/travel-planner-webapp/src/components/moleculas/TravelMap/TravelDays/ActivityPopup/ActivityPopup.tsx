import { Typography } from '@mui/material';
import { Popup } from 'react-leaflet';

import { TripDayActivity } from 'src/services/trips/TripDayActivity';

import styles from './ActivityPopup.module.scss';


export interface ActivityPopupProps {
    activity: TripDayActivity;
}

export function ActivityPopup({ activity }: ActivityPopupProps) {
    return (
        <Popup className={styles.popup} closeButton={false}>
            <Typography>
                {activity.name}
            </Typography>
        </Popup>
    );
};
