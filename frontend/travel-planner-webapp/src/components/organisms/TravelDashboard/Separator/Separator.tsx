import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { IconButton } from '@mui/material';

import { IntroStep, useIntroJourney } from 'src/components/moleculas/IntroJourney';

import styles from './Separator.module.scss';


export interface SeparatorProps {
    handleMouseDown: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
    handleExpandRightPane: () => void;
    handleExpandLeftPane: () => void;
}

export function Separator({ handleMouseDown, handleExpandRightPane, handleExpandLeftPane }: SeparatorProps) {
    const { nextStep } = useIntroJourney();

    return (
        <div className={styles.separator} onMouseDown={handleMouseDown}>
            <IconButton
                data-intro-step={IntroStep.ExpandMap}
                onClick={() => {
                    nextStep();
                    handleExpandRightPane();
                }}
                onMouseDown={e => e.stopPropagation()}
            >
                <ChevronLeft />
            </IconButton>
            <IconButton
                data-intro-step={IntroStep.CollapseMap}
                onClick={() => {
                    nextStep();
                    handleExpandLeftPane();
                }}
                onMouseDown={e => e.stopPropagation()}
            >
                <ChevronRight />
            </IconButton>
        </div>
    );
};
