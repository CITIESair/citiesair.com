import { Box, Stack, TextField, Typography } from "@mui/material";

const OptionalMessage = (props) => {
    const {
        label = "Optional Message",
        value,
        handleChange,
        maxLength,
        showTip = true,
        disabled
    } = props;
    const currentLength = value ? value.length : 0;

    return (
        <Stack direction="column">
            <TextField
                label={label}
                multiline
                minRows={2}
                maxRows={4}
                inputProps={{
                    maxLength,
                }}
                value={value || ''}
                onChange={(event) => {
                    handleChange(event);
                }}
                disabled={disabled}
            />
            <Stack direction="row" gap={1} justifyContent="space-between" sx={{ mx: 1, my: 0.5 }}>
                {showTip ? (
                    <Typography color="text.secondary" variant="caption">
                        Optional message that will appear in the alert
                    </Typography>
                ) : <Box />}

                <Typography color="text.secondary" variant="caption" textAlign="right">
                    {currentLength}/{maxLength}
                </Typography>
            </Stack>
        </Stack>
    );
};

export default OptionalMessage;