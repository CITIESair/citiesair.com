import { useState, useEffect, createContext, useMemo } from 'react';

export const ScreenContext = createContext();

// Helper function to change layout of the screen based on current's month
// (arrange the left and right sections of the screen)
// to mitigate burn-in if the same static image is displayed over a long period of time
function returnIsLayoutReversed() {
    let months = [0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1]; // 12 months of a year, change the layout every two months
    let now = new Date();
    let thisMonthIndex = now.getMonth(); // get the index of this Month (0-11)
    // Return a boolean value if the layout should be reversed
    return (months[thisMonthIndex] !== 0);
}

export function ScreenProvider({ children }) {
    const [isLayoutReversed, setIsLayoutReversed] = useState();

    // Tweak the layout of the screen to prevent burn-in
    useEffect(() => {
        setIsLayoutReversed(returnIsLayoutReversed());

        // Set up an interval to call the function every day
        const oneDayInMilliseconds = 24 * 60 * 60 * 1000;
        const intervalId = setInterval(() => {
            setIsLayoutReversed(returnIsLayoutReversed());
        }, oneDayInMilliseconds);

        return () => {
            clearInterval(intervalId);
        };
    }, []);

    // eslint-disable-next-line max-len
    const providerValue = useMemo(() => ({
        isLayoutReversed
    }), [isLayoutReversed]);

    // return context provider
    return (
        <ScreenContext.Provider value={providerValue}>
            {children}
        </ScreenContext.Provider>
    );
}
