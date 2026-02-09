import { Chip, Tooltip, Skeleton, ChipProps } from '@mui/material';
import { ReactNode } from 'react';

interface CustomChipProps extends ChipProps {
    tooltipTitle?: string;
    label?: ReactNode;
}

// Custom Chip component to display metadata
const CustomChip = (props: CustomChipProps) => {
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
