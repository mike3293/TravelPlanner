import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Link, Typography } from '@mui/material';
import classNames from 'classnames';
import { useCallback, useState } from 'react';

import { useMobile } from 'src/components/hooks/useMedia';
import { downloadFile } from 'src/components/utils/downloadFile';
import { generateKmzAsync, MarkerGroup } from 'src/components/utils/generateKmz';

import { IntroStep } from '../../../IntroJourney';

import styles from './ExportKmz.module.scss';


export interface ExportKmzProps {
    tripName?: string;
    markerPointGroups: MarkerGroup[];
}

export function ExportKmz({ tripName, markerPointGroups }: ExportKmzProps) {
    const isMobile = useMobile();
    const [isOpen, setIsOpen] = useState(false);

    const exportKmz = useCallback(async () => {
        const kmz = await generateKmzAsync(markerPointGroups);
        downloadFile(`${tripName}.kmz`, kmz);
        setIsOpen(true);
    }, [markerPointGroups, tripName]);

    return (
        <>
            <Button
                className={classNames(styles.exportButton, isMobile && styles.exportButtonMobile)}
                data-intro-step={IntroStep.ExportKmz}
                variant='contained'
                onClick={exportKmz}
                disabled={markerPointGroups.length === 0}
            >
                Export KMZ
            </Button>
            <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
                <DialogTitle id='kmz-dialog-title'>KMZ Import</DialogTitle>
                <DialogContent dividers>
                    <Typography gutterBottom>
                        Learn how to import KMZ files by following this guide:
                    </Typography>
                    <Link href='/KMZ import guide.pdf' target='_blank' rel='noopener'>
                        KMZ import guide
                    </Link>
                    <br />
                    <br />
                    <Typography gutterBottom>
                        You can also check your maps here:
                    </Typography>
                    <Link href='https://www.google.com/maps/d' target='_blank' rel='noopener'>
                        Google My Maps
                    </Link>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setIsOpen(false)} color='primary'>
                        OK
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};
