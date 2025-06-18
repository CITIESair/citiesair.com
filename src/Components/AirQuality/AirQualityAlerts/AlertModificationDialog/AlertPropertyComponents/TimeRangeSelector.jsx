import { useState, useEffect, useCallback } from "react";
import { Box, Stack, ToggleButtonGroup, ToggleButton } from "@mui/material";
import { useTheme } from "@emotion/react";
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { SimplePicker } from "./SimplePicker";
import { HOURS } from "./HOURS";

const PREDEFINED_RANGES = {
    allday: { id: "allday", label: "All Day", from: HOURS[0].value, to: HOURS[HOURS.length - 1].value },
    business: { id: "business", label: "Business Hours", from: HOURS[7].value, to: HOURS[17].value },
    custom: { id: "custom", label: "Custom" }
};

const TimeRangeSelector = ({ value = [null, null], disabled, handleChange }) => {
    const theme = useTheme();
    const [predefinedRange, setPredefinedRange] = useState(null);

    // Sync mode with incoming value
    useEffect(() => {
        console.log(value)
        const [fromHour, toHour] = value;
        const matched = Object.values(PREDEFINED_RANGES).find(m => m.from === fromHour && m.to === toHour);
        setPredefinedRange(matched ? matched.id : PREDEFINED_RANGES.custom.id);
    }, [value, PREDEFINED_RANGES]);

    // Handle toggle selection
    const handleModeChange = useCallback((_, newMode) => {
        if (!newMode) return;
        setPredefinedRange(newMode);
        const r = PREDEFINED_RANGES[newMode];
        if (r.from != null && r.to != null) {
            handleChange([r.from, r.to]);
        }
    }, [handleChange]);

    const [fromHour, toHour] = value;

    return (
        <Stack direction="row" alignItems="start" gap={1} width="100%">
            <Box
                aria-hidden={true}
                sx={{
                    '& .MuiSvgIcon-root': {
                        color: disabled ? theme.palette.text.secondary : theme.palette.text.primary
                    }
                }}
            >
                <AccessTimeIcon sx={{ mt: 0.75 }} />
            </Box>

            <Stack direction="column" width="100%" gap={1.5}>
                <ToggleButtonGroup
                    fullWidth={true}
                    color={disabled ? "standard" : "primary"}
                    value={predefinedRange || PREDEFINED_RANGES.allday.id}
                    exclusive
                    onChange={handleModeChange}
                    size="small"
                    disabled={disabled}
                >
                    {Object.values(PREDEFINED_RANGES).map(range => (
                        <ToggleButton
                            key={range.id}
                            value={range.id}
                            aria-label={range.label}
                            sx={{ textTransform: 'none' }}
                            size="small"
                        >
                            {range.label}
                        </ToggleButton>
                    ))}
                </ToggleButtonGroup>

                <Stack direction="row" flex={1} gap={1}>
                    <SimplePicker
                        label="From"
                        value={fromHour}
                        options={HOURS}
                        disabled={disabled || predefinedRange !== "custom"}
                        handleChange={(e) => handleChange([e.target.value, value[1]])}
                        flex={1}
                    />
                    <SimplePicker
                        label="To"
                        value={toHour}
                        options={HOURS.filter(h => h.value > fromHour)}
                        disabled={disabled || predefinedRange !== "custom"}
                        handleChange={(e) => handleChange([value[0], e.target.value])}
                        flex={1}
                    />
                </Stack>
            </Stack>
        </Stack>
    );
};

export default TimeRangeSelector;
