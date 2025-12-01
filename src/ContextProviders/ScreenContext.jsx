import { useState, useEffect, createContext, useMemo, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import useSchoolMetadata from '../hooks/useSchoolMetadata';
import { PreferenceContext } from './PreferenceContext';
import { isValidArray, isWithinDisplayHours } from '../Utils/UtilFunctions';

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
    const [shouldDisplayScreen, setShouldDisplayScreen] = useState(isWithinDisplayHours());

    const navigate = useNavigate();
    const { data: schoolMetadata } = useSchoolMetadata();
    const { setLanguage } = useContext(PreferenceContext);

    // Persistent carousel index
    const carouselIndex = useRef(0);

    useEffect(() => {
        const intervals = [];

        // --- Should Display Screen (to save energy) ---
        const displayInterval = setInterval(() => {
            setShouldDisplayScreen(isWithinDisplayHours());
        }, 60 * 1000);
        intervals.push(displayInterval);

        // --- Language Rotation ---
        if (schoolMetadata && isValidArray(schoolMetadata.languages)) {
            const langs = schoolMetadata.languages;
            if (langs.length > 1) {
                const updateLanguage = () => {
                    const minute = new Date().getMinutes();
                    setLanguage(langs[minute % langs.length]);
                };

                updateLanguage(); // initial
                const langInterval = setInterval(updateLanguage, 60 * 1000);
                intervals.push(langInterval);
            }
        }

        // --- Screen Burn-in Prevention Layout Flip ---
        const updateLayout = () => setIsLayoutReversed(returnIsLayoutReversed());
        updateLayout(); // initial
        const layoutInterval = setInterval(updateLayout, 24 * 60 * 60 * 1000);
        intervals.push(layoutInterval);

        // --- Carousel Rotation Logic ---
        const params = new URLSearchParams(window.location.search);
        const routes = params.get("carousel")?.split(",") ?? [];
        const intervalSec = Number(params.get("intervalSeconds")) || 30;

        if (routes.length > 0) {
            const rotateCarousel = () => {
                carouselIndex.current = (carouselIndex.current + 1) % routes.length;
                navigate({
                    pathname: routes[carouselIndex.current],
                    search: `?${params.toString()}`,
                    replace: true
                });
            };

            const carouselInterval = setInterval(rotateCarousel, intervalSec * 1000);
            intervals.push(carouselInterval);
        }

        return () => {
            intervals.forEach(clearInterval);
        };
    }, [navigate, schoolMetadata, setLanguage]);

    const providerValue = useMemo(() => ({
        isLayoutReversed, shouldDisplayScreen
    }), [isLayoutReversed, shouldDisplayScreen]);

    // return context provider
    return (
        <ScreenContext.Provider value={providerValue}>
            {children}
        </ScreenContext.Provider>
    );
}
