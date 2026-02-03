import { Chip, Tooltip, Skeleton } from '@mui/material';

// Custom Chip component to display metadata
const CustomChip = (props) => {
    const { tooltipTitle, label, ...otherProps } = props;

    const chip = (
        <Chip
            size="small"
            label={label || <Skeleton variant="text" sx={{ minWidth: '5rem' }} />}
            sx={{
                userSelect: 'text',
                height: 'auto',
                '& .MuiChip-label': {
                    userSelect: 'text',
                    whiteSpace: 'normal',
                    wordBreak: 'break-word',
                    py: 0.5
                }
            }}
            {...otherProps}
        />
    );


    return tooltipTitle ? (
        <Tooltip title={tooltipTitle} enterDelay={0} leaveDelay={200}>
            {chip}
        </Tooltip>
    ) : chip;
}

export default CustomChip;