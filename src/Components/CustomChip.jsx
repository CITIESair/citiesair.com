import { Chip, Tooltip, Skeleton } from '@mui/material';

// Custom Chip component to display metadata
const CustomChip = (props) => {
    const { tooltipTitle, label, ...otherProps } = props;

    const chip = (
        <Chip
            size="small"
            label={label || <Skeleton variant="text" sx={{ minWidth: '5rem' }} />}
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