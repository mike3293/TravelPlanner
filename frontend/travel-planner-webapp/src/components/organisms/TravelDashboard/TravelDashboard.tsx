import classNames from 'classnames';
import { PropsWithChildren } from 'react';

import { IntroJourneyProvider } from 'src/components/moleculas/IntroJourney';
import { TravelMap } from 'src/components/moleculas/TravelMap';

import { useTravelDashboardResize } from './useTravelDashboardResize';
import { Separator } from './Separator';

import styles from './TravelDashboard.module.scss';


export function TravelDashboard({ children }: PropsWithChildren) {
    const {
        leftPaneWidth,
        isDragging,
        handleMouseDown,
        handleExpandRightPane,
        handleExpandLeftPane,
        containerRef,
    } = useTravelDashboardResize();

    return (
        <IntroJourneyProvider>
            <div className={styles.container} ref={containerRef}>
                <div className={classNames(styles.leftPane, !isDragging && styles.transition)} style={{ width: `${leftPaneWidth}px` }}>
                    <div className={styles.childContainer}>
                        {children}
                    </div>
                </div>
                <Separator
                    handleMouseDown={handleMouseDown}
                    handleExpandRightPane={handleExpandRightPane}
                    handleExpandLeftPane={handleExpandLeftPane}
                />
                <div className={classNames(!isDragging && styles.transition)} style={{ width: `calc(100% - ${leftPaneWidth + 40}px)` }}>
                    <TravelMap />
                </div>
            </div>
        </IntroJourneyProvider>
    );
};
