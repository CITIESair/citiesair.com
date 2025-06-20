import { useState, useEffect, useCallback } from "react";
import { Box, Stack, ToggleButtonGroup, ToggleButton } from "@mui/material";
import { useTheme } from "@emotion/react";
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { SimplePicker } from "./SimplePicker";
import { HOURS } from "./HOURS";
import { isValidArray } from "../../../../../Utils/UtilFunctions";

const PREDEFINED_RANGES = {
    allday: { id: "allday", label: "All Day", from: HOURS[0].value, to: HOURS[HOURS.length - 1].value },
    business: { id: "business", label: "Business Hours", from: HOURS[7].value, to: HOURS[17].value },
    custom: { id: "custom", label: "Custom" }
};

const TimeRangeSelector = ({ value: timeRange, disabled, handleChange }) => {
    const theme = useTheme();

    // Always normalize into a [string, string]
    const [fromValue, toValue] = isValidArray(timeRange)
        ? timeRange
        : [PREDEFINED_RANGES.allday.from, PREDEFINED_RANGES.allday.to];

    const [predefinedRange, setPredefinedRange] = useState(() => {
        // Sync initial toggle‑button state
        const match = Object.values(PREDEFINED_RANGES)
            .find(r => r.from === fromValue && r.to === toValue);
        return match ? match.id : PREDEFINED_RANGES.custom.id;
    });

    // When `timeRange` actually changes, keep buttons in sync:
    useEffect(() => {
        const match = Object.values(PREDEFINED_RANGES)
            .find(r => r.from === fromValue && r.to === toValue);
        setPredefinedRange(match ? match.id : PREDEFINED_RANGES.custom.id);
    }, [fromValue, toValue]);

    const handleModeChange = useCallback((_, newMode) => {
        if (!newMode) return;
        setPredefinedRange(newMode);
        const range = PREDEFINED_RANGES[newMode];
        if (range.from != null && range.to != null) {
            handleChange([range.from, range.to]);
        }
    }, [handleChange]);

    return (
        <Stack direction="row" alignItems="start" gap={1} width="100%">
            <Box
                aria-hidden
                sx={{
                    '& .MuiSvgIcon-root': {
                        color: disabled
                            ? theme.palette.text.secondary
                            : theme.palette.text.primary
                    }
                }}
            >
                <AccessTimeIcon sx={{ mt: 0.75 }} />
            </Box>

            <Stack direction="column" width="100%" gap={1.5}>
                <ToggleButtonGroup
                    fullWidth
                    color={disabled ? "standard" : "primary"}
                    value={predefinedRange}
                    exclusive
                    onChange={handleModeChange}
                    size="small"
                    disabled={disabled}
                >
                    {Object.values(PREDEFINED_RANGES).map(r => (
                        <ToggleButton
                            key={r.id}
                            value={r.id}
                            aria-label={r.label}
                            sx={{ textTransform: 'none' }}
                            size="small"
                        >
                            {r.label}
                        </ToggleButton>
                    ))}
                </ToggleButtonGroup>

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
            </Stack>
        </Stack>
    );
};


export default TimeRangeSelector;
