import { useState, useEffect, useCallback } from "react";
import { Box, Stack, ToggleButtonGroup, ToggleButton, useMediaQuery, useTheme, Typography, Theme } from "@mui/material";
import WatchLaterIcon from '@mui/icons-material/WatchLater';
import { SimplePicker } from "../AirQuality/AirQualityAlerts/AlertModificationDialog/AlertPropertyComponents/SimplePicker";
import { HOURS } from "./TimeRangeUtils";
import { isValidArray } from "../../Utils/UtilFunctions";
import { PREDEFINED_TIMERANGES } from "./TimeRangeUtils";

interface TimeRangeSelectorProps {
    timeRange: [number | string, number | string] | null;
    defaultTimeRange: [number | string, number | string];
    disabled?: boolean;
    handleChange: (range: [number | string, number | string | null]) => void;
    isResponsive?: boolean;
    hasTitle?: boolean;
}

const TimeRangeSelector: React.FC<TimeRangeSelectorProps> = (props) => {
    const { timeRange, defaultTimeRange, disabled, handleChange, isResponsive = false, hasTitle = false } = props;

    const theme = useTheme();
    const isLargeScreen = useMediaQuery((theme: Theme) => theme.breakpoints.up('lg'));

    const [displayFromToPickers, setDisplayFromToPickers] = useState<boolean>(false);

    // Always normalize into a [string, string]
    const [startTime, endTime] = isValidArray(timeRange) ? timeRange : defaultTimeRange;

    const [predefinedRange, setPredefinedRange] = useState<string>(() => {
        // Sync initial toggle‑button state
        const match = Object.values(PREDEFINED_TIMERANGES)
            .find(r => 'start' in r && r.start === Number(startTime) && 'end' in r && r.end === Number(endTime));
        return match ? match.id : PREDEFINED_TIMERANGES.custom.id;
    });

    // When `timeRange` actually changes, keep buttons in sync:
    useEffect(() => {
        const match = Object.values(PREDEFINED_TIMERANGES)
            .find(r => 'start' in r && r.start === Number(startTime) && 'end' in r && r.end === Number(endTime));
        setPredefinedRange(match ? match.id : PREDEFINED_TIMERANGES.custom.id);
    }, [startTime, endTime]);

    const handleModeChange = useCallback((event: React.MouseEvent<HTMLElement>, newMode: string | null) => {
        if (!newMode) return;
        setPredefinedRange(newMode);
        const range = PREDEFINED_TIMERANGES[newMode as keyof typeof PREDEFINED_TIMERANGES];
        if ('start' in range && 'end' in range && range.start != null && range.end != null) {
            handleChange([range.start.toString(), range.end.toString()]);
        }

        // only display the hour pickers if custom time is used
        setDisplayFromToPickers(newMode === PREDEFINED_TIMERANGES.custom.id);
    }, [handleChange]);

    // Add useMediaQuery to detect xs screens
    const extraSmallScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));

    return (
        <Stack direction={hasTitle ? "column" : "row"} alignItems="start" gap={0.5} width="100%">
            {
                hasTitle ?
                    (isLargeScreen && isResponsive ? <Typography color="text.secondary" sx={{ textTransform: "uppercase" }}>Time Range</Typography> : null)
                    : (
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
                    )
            }

            <Stack direction="column" width="100%" gap={1.5}>
                <ToggleButtonGroup
                    fullWidth={extraSmallScreen}
                    color={disabled ? "standard" : "primary"}
                    value={predefinedRange}
                    exclusive
                    onChange={handleModeChange}
                    size="small"
                    disabled={disabled}
                    orientation={isResponsive ?
                        (isLargeScreen ? "vertical" : "horizontal") :
                        "horizontal"
                    }
                >
                    {Object.values(PREDEFINED_TIMERANGES).map((range, idx, arr) => (
                        <ToggleButton
                            key={range.id}
                            value={range.id}
                            aria-label={range.label}
                            sx={{
                                color: "text.secondary",
                                textTransform: 'none',
                                px: (idx === arr.length - 1) ? 2 : 1,
                                py: 0.5,
                                flex: (idx === arr.length - 1) ? 1 : undefined
                            }}
                            size="small"
                        >
                            {range.label}
                            {'timeRangeLabel' in range && range.timeRangeLabel && (
                                <>
                                    &nbsp;({range.timeRangeLabel})
                                </>
                            )
                            }
                        </ToggleButton>
                    ))}
                </ToggleButtonGroup>

                {
                    displayFromToPickers ? (
                        <Stack direction="row" flex={1} gap={1}>
                            <SimplePicker
                                label="From"
                                value={startTime}
                                options={HOURS}
                                disabled={disabled || predefinedRange !== "custom"}
                                handleChange={(e) => {
                                    const newStartTime = Number(e.target.value);
                                    const currentEndTime = Number(endTime);
                                    // Set toValue to null if new startTime is larger than endTime's current value
                                    if (newStartTime > currentEndTime) {
                                        handleChange([e.target.value, null]);
                                    }
                                    // Else, proceed with startTime
                                    else {
                                        handleChange([e.target.value, endTime])
                                    }
                                }}
                                flex={1}
                            />
                            <SimplePicker
                                label="To"
                                value={endTime}
                                options={HOURS.filter(h => h.value > Number(startTime))}
                                disabled={disabled || predefinedRange !== "custom"}
                                handleChange={e => handleChange([startTime, e.target.value])}
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
