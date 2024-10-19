import { createContext, useContext } from 'react';


export interface IntroJourneyContextValue {
    introInProgress: boolean;
    nextStep: () => void;
    /** @param delay - Specify delay in milliseconds */
    continueIntroInProgress: (delay?: number) => void;
}

export interface IntroJourneyContextValueInternal extends IntroJourneyContextValue {
    initialized: boolean;
}

export const IntroJourneyContext = createContext<IntroJourneyContextValue>({
    introInProgress: false,
    nextStep: () => undefined,
    continueIntroInProgress: () => undefined,
    initialized: false,
} as IntroJourneyContextValue);

export function useIntroJourney() {
    const context = useContext(IntroJourneyContext);

    if (!(context as IntroJourneyContextValueInternal).initialized) {
        throw new Error('useIntroJourney must be used within a IntroJourneyProvider');
    }

    return context;
}
