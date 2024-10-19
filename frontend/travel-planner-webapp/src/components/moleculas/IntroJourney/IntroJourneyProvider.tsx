import { useTheme } from '@mui/material';
import { PropsWithChildren, useCallback, useMemo, useState } from 'react';
import Joyride, { ACTIONS, CallBackProps, EVENTS, STATUS, Step } from 'react-joyride';
import { useNavigate } from 'react-router-dom';

import { useMobile } from 'src/components/hooks/useMedia';
import { useOnDidMount } from 'src/components/hooks/useOnDidMount';
import { mapResizeEventEmitter } from 'src/components/utils/events';
import { links } from 'src/links';

import { IntroJourneyContext } from './context';
import { getSteps } from './getSteps';


const localStorageFlag = 'introShown';
const alreadyShown = localStorage.getItem(localStorageFlag);

const handleResize = () => window.dispatchEvent(new Event('resize'));

/** Use `data-intro-step` attribute to mark elements for intro flow */
export function IntroJourneyProvider({ children }: PropsWithChildren) {
    const navigate = useNavigate();

    const [run, setRun] = useState(false);
    const [introInProgress, setIntroInProgress] = useState(false);
    const [stepIndex, setStepIndex] = useState(0);
    const [steps, setSteps] = useState<Step[]>([]);

    const isMobile = useMobile();
    const theme = useTheme();

    useOnDidMount(() => {
        if (alreadyShown) {
            return;
        }

        if (isMobile) {
            // It's needed to avoid double click on mobile
            import('./IntroJourneyMobile.module.scss');
        }

        navigate(links.trips);

        setSteps(getSteps(isMobile));
        setIntroInProgress(true);
        setRun(true);

        mapResizeEventEmitter.subscribe(handleResize);
    }, () => mapResizeEventEmitter.unsubscribe(handleResize));

    const handleJoyrideCallback = useCallback(({ action, index, status, type, step }: CallBackProps) => {
        const isFinnished = ([STATUS.FINISHED, STATUS.SKIPPED] as string[]).includes(status);
        if (isFinnished || action === ACTIONS.CLOSE) {
            setRun(false);
            setIntroInProgress(false);
            setStepIndex(0);
            localStorage.setItem(localStorageFlag, 'true');
        } else if (type === EVENTS.STEP_AFTER) {
            if (step.data?.needStop) {
                setRun(false);
            }

            const nextStepIndex = index + (action === ACTIONS.PREV ? -1 : 1);
            setStepIndex(nextStepIndex);
        }
    }, []);

    const contextValue = useMemo(() => ({
        introInProgress,
        nextStep: () => introInProgress ? setStepIndex(prev => prev + 1) : undefined,
        continueIntroInProgress: (delay = 0) => introInProgress ? setTimeout(() => setRun(true), delay) : undefined,
        initialized: true,
    }), [introInProgress]);

    return (
        <>
            <Joyride
                callback={handleJoyrideCallback}
                continuous
                hideBackButton
                disableScrolling
                run={run}
                stepIndex={stepIndex}
                steps={steps}
                styles={{
                    options: {
                        primaryColor: theme.palette.primary.main,
                        width: 300,
                        zIndex: 2000,
                    },
                }}
                locale={{
                    last: 'Finish',
                }}
            />
            <IntroJourneyContext.Provider value={contextValue}>
                {children}
            </IntroJourneyContext.Provider>
        </>
    );
};
