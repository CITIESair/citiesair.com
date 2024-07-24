/* eslint-disable */
import { ResponsiveCalendar } from '@nivo/calendar';
import { useEffect, useRef } from 'react';
import { useTheme } from '@mui/material/styles';
import { Box, Chip, Typography } from '@mui/material';

import parse from 'html-react-parser';
import { replacePlainHTMLWithMuiComponents } from '../../../Utils/Utils';
import { generateDiscreteColorGradientArray, generateCssBackgroundGradient } from '../../../Utils/Gradient/GradientUtils';

export const yearSpacing = 40;

export const getCalendarChartMargin = (isPortrait) => {
    return isPortrait
        ? { top: 20, right: 0, bottom: 0, left: 20 }
        : { top: 30, right: 40, bottom: 0, left: 40 }
}

export const calculateCalendarChartHeight = (yearRange, yearHeight, calendarChartMargin) => {
    const numberOfYears = yearRange[1] - yearRange[0] + 1;
    /**
     * The height of the calendar chart's container should be made to fit at least two years of data
     * This way, even if the yearRange (from the slider) is < 2 years, and the following subcharts
     * don't make use of this yearRange (since they have <= 2 years of data), they will still render properly
     */
    const minYearsForHeightCalculation = 2;

    return Math.max(numberOfYears, minYearsForHeightCalculation) * (yearHeight + yearSpacing) + calendarChartMargin.top + calendarChartMargin.bottom;
};

export const calculateValueRange = (data) => {
    const values = data.map((item) => item.value);
    return { min: Math.min(...values), max: Math.max(...values) };
};

export const CalendarChart = (props) => {
    const { data, dateRange, valueRangeBoxTitle, valueRange, yearRange, isPortrait, options } = props;

    const calendarChartMargin = getCalendarChartMargin(isPortrait);

    const theme = useTheme();

    const dynamicFrom = `${yearRange[0]}-01-01`
    const dynamicTo = `${yearRange[1]}-12-31`

    // Filter data based on the selected year range
    const filteredData = data.filter(item => {
        const year = new Date(item.day).getFullYear();
        return year >= yearRange[0] && year <= yearRange[1];
    });

    // Adjust the value range based on the filtered data
    let filteredValueRange = valueRange
    if (filteredData.length > 0) {
        filteredValueRange = calculateValueRange(filteredData, options?.colorAxis)
    }

    // Function to extract tooltip text from HTML tooltip
    const extractTooltipText = (tooltip) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(tooltip, 'text/html');
        return doc.body.innerHTML;
    };

    // Function to check if a date is in the first two rows of the chart
    // Used to anchor the tooltip to the bottom while hovering over
    // the first two rows of the chart
    const inFirstTwoRowsOfChart = (dateStr, dateRange) => {
        const date = new Date(dateStr);
        const dayOfWeek = date.getDay();

        // Check if the date is Sunday (0) or Monday (1)
        const isFirstTwoDaysOfWeek = dayOfWeek === 0 || dayOfWeek === 1;

        // Extract the first year from the date range once
        const firstYear = new Date(dateRange.min).getFullYear();

        // Check if the date is in the first year of the date range
        const isInFirstYear = date.getFullYear() === firstYear;

        return isFirstTwoDaysOfWeek && isInFirstYear;
    };

    const colors = generateDiscreteColorGradientArray({
        colors: options?.colorAxis?.colors,
        numSteps: options?.colorAxis?.gradientSteps
    });

    const showLegend = () => {
        return (
            <ValueRangeBox
                title={valueRangeBoxTitle}
                valueRange={valueRange}
                filteredValueRange={filteredValueRange}
                colorAxis={options?.colorAxis}
                isPortrait={isPortrait}
            />
        )
    }

    return (
        <>
            {options?.legend?.position !== "none" && showLegend()}

            <ResponsiveCalendar
                data={data}
                from={dynamicFrom}
                to={dynamicTo}
                emptyColor={'transparent'}
                theme={{
                    text: {
                        fill: theme.palette.text.secondary,
                    },
                    fontSize: '0.75rem',
                    tooltip: {
                        container: {
                            background: theme.palette.mode === 'dark' ? '#2b2b2b' : '#fff',
                            color: theme.palette.text.primary,
                        },
                    },
                    axis: {
                        ticks: {
                            line: {
                                stroke: theme.palette.mode === 'dark' ? '#2b2b2b' : '#fff',
                            },
                            text: {
                                fill: theme.palette.text.primary,
                            },
                        },
                    },
                    grid: {
                        line: {
                            stroke: theme.palette.mode === 'dark' ? '#2b2b2b' : '#fff',
                        },
                    },
                }}
                colors={colors}
                minValue={options?.colorAxis?.minValue}
                maxValue={options?.colorAxis?.maxValue}
                margin={calendarChartMargin}
                yearSpacing={yearSpacing}
                monthBorderColor={theme.palette.text.primary}
                monthBorderWidth={1}
                daySpacing={0.25}
                dayBorderWidth={0}
                tooltip={({ day, value, color }) => {
                    const tooltipData = data.find(item => item.day === day);
                    const tooltipText = tooltipData ? extractTooltipText(tooltipData.tooltip) : '';

                    return (
                        <CustomTooltip
                            day={day}
                            color={color}
                            tooltipText={tooltipText}
                            dateRange={dateRange}
                            inFirstTwoRowsOfChart={inFirstTwoRowsOfChart}
                        />
                    );
                }}
            />
        </>
    );
};

// Custom tooltip component for the Calendar chart
const CustomTooltip = ({ day, color, tooltipText, dateRange, inFirstTwoRowsOfChart }) => {
    const tooltipBoxRef = useRef(null);

    // If the cell hovered over is in the first two rows of the chart,
    // move the tooltip to the bottom of the chart
    // Read subsequent comments to understand why we need to do this
    useEffect(() => {
        if (tooltipBoxRef.current && inFirstTwoRowsOfChart(day, dateRange)) {
            const parentDiv = tooltipBoxRef.current.parentElement;
            if (parentDiv) {
                parentDiv.style.top = '11vh';
            }
        }
    }, [tooltipBoxRef, inFirstTwoRowsOfChart]);


    // Note that our Box is just a container 'inside' the tooltip
    // The tooltip itself is actually the Box's parent div
    return (
        <Box ref={tooltipBoxRef} className='nivo-tooltip'>
            <Chip sx={{ backgroundColor: color, mr: 0.5, height: '10px', width: '10px', borderRadius: '50%' }} />
            {parse(tooltipText, { replace: replacePlainHTMLWithMuiComponents })}
        </Box>
    );
};

const ValueRangeBox = ({ title, filteredValueRange, valueRange, colorAxis, isPortrait }) => {
    if (valueRange?.min === null || valueRange?.max === null) return null;

    const { colors, minValue, maxValue } = colorAxis;
    let rangeBoxMinValue = minValue, rangeBoxMaxValue = maxValue;

    if (minValue === undefined) rangeBoxMinValue = valueRange.min;
    if (maxValue === undefined) rangeBoxMaxValue = valueRange.max;

    if (valueRange.min < rangeBoxMinValue) rangeBoxMinValue = valueRange.min;
    if (valueRange.max > rangeBoxMaxValue) rangeBoxMaxValue = valueRange.max;

    const theme = useTheme();

    const calculateMarkerPositionOnRangeBox = (value) => {
        const position = ((value - rangeBoxMinValue) / (rangeBoxMaxValue - rangeBoxMinValue)) * 100;
        return `${position}%`;
    };

    const labelStyle = {
        position: 'absolute',
        fontSize: '0.75rem',
        color: theme.palette.text.secondary,
        lineHeight: 1,
        textAlign: 'center',
        transform: 'translateX(-50%)',
        minWidth: '75px',
        whiteSpace: 'nowrap',
    };
    const topLabelStyle = {
        top: '-1.5rem',
        transform: 'translateX(-50%)'
    };
    const bottomLabelStyle = {
        bottom: '-1.25rem',
        transform: isPortrait ? 'translateX(-100%)' : 'translateX(-50%)'
    };

    const triangleStyle = {
        position: 'absolute',
        width: 0,
        height: 0,
        borderLeft: '0.25rem solid transparent',
        borderRight: '0.25rem solid transparent',
        transform: 'translateX(-50%)',
    };
    const topTriangleStyle = {
        top: '-0.5rem',
        borderTop: `0.25rem solid ${theme.palette.text.secondary}`
    };
    const bottomTriangleStyle = {
        bottom: '-0.5rem',
        borderBottom: `0.25rem solid ${theme.palette.text.secondary}`
    };

    return (
        <Box sx={{
            position: 'sticky',
            width: 'fit-content',
            marginTop: '1.5rem',
            float: 'right',
            right: (isPortrait ? '0' : '50px')
        }}>
            <Typography sx={{
                display: 'inline',
                position: 'absolute',
                textAlign: 'right',
                transform: 'translateX(calc(-100% - 0.5rem))',
                fontSize: '0.75rem',
                lineHeight: 1.25,
                fontWeight: 500,
                color: 'text.secondary'
            }}>
                {title}
            </Typography>
            <Box sx={{
                background: generateCssBackgroundGradient({ gradientDirection: 'to right', colors: colors, optionalMaxValue: rangeBoxMaxValue }),
                color: theme.palette.text.secondary,
                border: `1px solid ${theme.palette.text.secondary}`,
                width: isPortrait ? '250px' : '300px',
                height: '1rem',
                position: 'relative',
                justifyContent: 'space-between',
            }}>
                <span style={{ ...labelStyle, ...topLabelStyle, left: calculateMarkerPositionOnRangeBox(filteredValueRange.min) }}>min: {Math.round(filteredValueRange.min)}</span>
                <span style={{ ...labelStyle, ...bottomLabelStyle, left: calculateMarkerPositionOnRangeBox(filteredValueRange.max) }}>max: {Math.round(filteredValueRange.max)}</span>
                <div style={{ ...triangleStyle, ...topTriangleStyle, left: calculateMarkerPositionOnRangeBox(filteredValueRange.min) }}></div>
                <div style={{ ...triangleStyle, ...bottomTriangleStyle, left: calculateMarkerPositionOnRangeBox(filteredValueRange.max) }}></div>
            </Box>
        </Box>
    );
};

