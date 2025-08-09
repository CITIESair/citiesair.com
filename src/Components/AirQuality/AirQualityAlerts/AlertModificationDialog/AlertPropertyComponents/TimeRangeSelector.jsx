import { useState, useEffect, useCallback } from "react";
import { Box, Stack, ToggleButtonGroup, ToggleButton } from "@mui/material";
import { useTheme } from "@mui/material";
import WatchLaterIcon from '@mui/icons-material/WatchLater';
import { SimplePicker } from "./SimplePicker";
import { HOURS } from "./HOURS";
import { isValidArray } from "../../../../../Utils/UtilFunctions";
import { PREDEFINED_TIMERANGES } from "./PREDEFINED_TIMERANGES";
import { getAlertDefaultPlaceholder, AirQualityAlertKeys } from "../../../../../ContextProviders/AirQualityAlertContext";
import AlertTypes from "../../AlertTypes";
import { useMediaQuery } from "@mui/material";

const TimeRangeSelector = ({ value: timeRange, disabled, handleChange }) => {
    const theme = useTheme();

    const [displayFromToPickers, setDisplayFromToPickers] = useState(false);

    // Always normalize into a [string, string]
    const [fromValue, toValue] = isValidArray(timeRange)
        ? timeRange
        : getAlertDefaultPlaceholder(AlertTypes.threshold.id)[AirQualityAlertKeys.time_range];

    const [predefinedRange, setPredefinedRange] = useState(() => {
        // Sync initial toggle‑button state
        const match = Object.values(PREDEFINED_TIMERANGES)
            .find(r => r.from === fromValue && r.to === toValue);
        return match ? match.id : PREDEFINED_TIMERANGES.custom.id;
    });

    // When `timeRange` actually changes, keep buttons in sync:
    useEffect(() => {
        const match = Object.values(PREDEFINED_TIMERANGES)
            .find(r => r.from === fromValue && r.to === toValue);
        setPredefinedRange(match ? match.id : PREDEFINED_TIMERANGES.custom.id);
    }, [fromValue, toValue]);

    const handleModeChange = useCallback((_, newMode) => {
        if (!newMode) return;
        setPredefinedRange(newMode);
        const range = PREDEFINED_TIMERANGES[newMode];
        if (range.from != null && range.to != null) {
            handleChange([range.from, range.to]);
        }

        // only display the hour pickers if custom time is used
        setDisplayFromToPickers(newMode === PREDEFINED_TIMERANGES.custom.id);
    }, [handleChange]);

    // Add useMediaQuery to detect small screens

    const smallScreen = useMediaQuery((theme) => theme.breakpoints.down('md'));
    const extraSmallScreen = useMediaQuery((theme) => theme.breakpoints.down('sm'));

    return (
        <Stack direction="row" alignItems="start" gap={1} width="100%">
            <Box
                aria-hidden
                sx={{
                    '& .MuiSvgIcon-root': {
                        color: disabled
                            ? theme.palette.text.secondary
                            : theme.palette.primary.main,
                        verticalAlign: "-webkit-baseline-middle"
                    }
                }}
            >
                <WatchLaterIcon sx={{ mt: 0.75 }} />
            </Box>

            <Stack direction="column" width="100%" gap={1.5}>
                <ToggleButtonGroup
                    fullWidth={smallScreen}
                    color={disabled ? "standard" : "primary"}
                    value={predefinedRange}
                    exclusive
                    onChange={handleModeChange}
                    size="small"
                    disabled={disabled}
                >
                    {Object.values(PREDEFINED_TIMERANGES).map((range, idx, arr) => (
                        <ToggleButton
                            key={range.id}
                            value={range.id}
                            aria-label={range.label}
                            sx={{
                                textTransform: 'none',
                                px: 1.5,
                                flex: (idx === arr.length - 1) ? 1 : undefined,
                                lineHeight: extraSmallScreen ? 1.3 : undefined
                            }}
                            size="small"
                        >
                            {range.label}
                            {range.fromToLabel && (
                                extraSmallScreen ? (
                                    <>
                                        <br />
                                        {range.fromToLabel}
                                    </>
                                ) : (
                                    <> {range.fromToLabel}</>
                                )
                            )}
                        </ToggleButton>
                    ))}
                </ToggleButtonGroup>

                {
                    displayFromToPickers ? (
                        <Stack direction="row" flex={1} gap={1}>
                            <SimplePicker
                                label="From"
                                value={fromValue}
                                options={HOURS}
                                disabled={disabled || predefinedRange !== "custom"}
                                handleChange={e => handleChange([e.target.value, toValue])}
                                flex={1}
                            />
                            <SimplePicker
                                label="To"
                                value={toValue}
                                options={HOURS.filter(h => h.value > fromValue)}
                                disabled={disabled || predefinedRange !== "custom"}
                                handleChange={e => handleChange([fromValue, e.target.value])}
                                flex={1}
                            />
                        </Stack>
                    ) : null
                }
            </Stack>
        </Stack>
    );
};


export default TimeRangeSelector;
