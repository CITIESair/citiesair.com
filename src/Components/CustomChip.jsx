import { Chip, Tooltip, Skeleton } from '@mui/material';

// Custom Chip component to display metadata
const CustomChip = (props) => {
    const { tooltipTitle, label, ...otherProps } = props;
    return (
        <Tooltip title={tooltipTitle} enterDelay={0} leaveDelay={200}>
            <Chip
                size="small"
                label={label || <Skeleton variant="text" sx={{ minWidth: '5rem' }} />}
                {...otherProps}
            />
        </Tooltip>
    );
}

export default CustomChip;