import { Stack, TextField, Typography } from "@mui/material";

const CustomMessage = ({ value, handleChange, maxLength }) => {
    const currentLength = value ? value.length : 0;

    return (
        <Stack direction="column">
            <TextField
                label="Optional Message"
                multiline
                minRows={2}
                maxRows={4}
                inputProps={{
                    maxLength,
                }}
                value={value}
                onChange={(event) => {
                    handleChange(event);
                }}
            />
            <Stack direction="row" gap={1} justifyContent="space-between" sx={{ mx: 1, my: 0.5 }}>
                <Typography color="text.secondary" variant="caption">
                    Custom message that will appear in the alert
                </Typography>
                <Typography color="text.secondary" variant="caption">
                    {currentLength}/{maxLength}
                </Typography>
            </Stack>
        </Stack>
    );
};

export default CustomMessage;