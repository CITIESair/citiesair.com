import { useState, useEffect, createContext, useMemo, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import useSchoolMetadata from '../hooks/useSchoolMetadata';
import { PreferenceContext } from './PreferenceContext';
import { isValidArray } from '../Utils/UtilFunctions';

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

// Helper function to identify if now is within the display hours
// to blank the screen (for example, overnight)
const isWithinDisplayHours = () => {
    const params = new URLSearchParams(window.location.search);
    const displayHours = params.get("displayHours");
    if (!displayHours) return true; // Show screen if no parameter

    const [start, end] = displayHours.split("-").map(time => parseInt(time.replace(":", ""), 10));
    const now = parseInt(new Date().toTimeString().slice(0, 5).replace(":", ""), 10);

    if (start <= end) {
        // Regular range (same day, e.g., 06:00-20:00)
        return start <= now && now < end;
    } else {
        // Overnight range (e.g., 16:00-01:00)
        return now >= start || now < end;
    }
}

// Helper function to rotate through different routes in the carousel
function getCarouselIndex(routes, intervalSec) {
    const now = Math.floor(Date.now() / 1000);
    return Math.floor(now / intervalSec) % routes.length;
}

export function ScreenProvider({ children }) {
    const [isLayoutReversed, setIsLayoutReversed] = useState();
    const [shouldDisplayScreen, setShouldDisplayScreen] = useState(isWithinDisplayHours());

    const navigate = useNavigate();
    const { data: schoolMetadata } = useSchoolMetadata();
    const { setLanguage } = useContext(PreferenceContext);

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
                const index = getCarouselIndex(routes, intervalSec);
                const nextRoute = routes[index];

                const isExternal =
                    /^(https?:\/\/|[\w-]+(\.[\w-]+)+)/i.test(nextRoute);

                if (isExternal) {
                    // Auto-prepend https:// for domain-only routes
                    const url = nextRoute.startsWith("http")
                        ? `${nextRoute}?${params.toString()}`
                        : `https://${nextRoute}?${params.toString()}`;

                    window.location.replace(url);
                } else {
                    navigate({
                        pathname: nextRoute,
                        search: `?${params.toString()}`,
                        replace: true
                    });
                }
            };

            const carouselInterval = setInterval(rotateCarousel, intervalSec * 1000);
            intervals.push(carouselInterval);
        }

        return () => {
            intervals.forEach(clearInterval);

            // Set language to English for the rest of the website on component unmounts
            // (only components under <ScreenComponen> can rotate languages for now)
            setLanguage("en");
        }
    }, [navigate, schoolMetadata, setLanguage]);

    const providerValue = useMemo(() => ({
        isLayoutReversed, shouldDisplayScreen
    }), [isLayoutReversed, shouldDisplayScreen]);

    return (
        <ScreenContext.Provider value={providerValue}>
            {children}
        </ScreenContext.Provider>
    );
}
