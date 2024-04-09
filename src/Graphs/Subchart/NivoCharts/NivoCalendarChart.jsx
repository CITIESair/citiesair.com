/* eslint-disable */
import { ResponsiveCalendar } from '@nivo/calendar';
import { useEffect, useRef } from 'react';
import { useTheme } from '@mui/material/styles';
import { Box, Chip } from '@mui/material';

import parse from 'html-react-parser';
import { replacePlainHTMLWithMuiComponents } from '../../../Utils/Utils';

export const yearSpacing = 40;

export const getCalendarChartMargin = (isPortrait) => {
    return isPortrait
        ? { top: 20, right: 0, bottom: 0, left: 20 }
        : { top: 30, right: 40, bottom: 0, left: 40 }
}

export const CalendarChart = (props) => {
    const { data, dateRange, valueRange, isPortrait, options } = props;

    const calendarChartMargin = getCalendarChartMargin(isPortrait);

    const theme = useTheme();

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

    // Function to get color of the Calendar cells
    const colors = options?.colorAxis?.isGradient ?
        generateColorGradient(options?.colorAxis?.colors[0], options?.colorAxis?.colors[1], 100) :
        options?.colorAxis?.colors;

    const showLegend = () => {
        return (
            <GradientBox
                valueRange={valueRange}
                colors={options?.colorAxis?.colors}
                isPortrait={isPortrait}
            />
        )
    }

    return (
        <>
            {options?.legend?.position !== "none" && showLegend()}
            <ResponsiveCalendar
                data={data}
                from={dateRange?.min}
                to={dateRange?.max}
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

const GradientBox = ({ valueRange, colors, isPortrait }) => {

    if (valueRange?.min === null || valueRange?.max === null) return null;

    const theme = useTheme();

    // Create a gradient string from all colors in the colors array
    const gradient = colors.map((color, index, array) => {
        // Calculate the percentage position for each color
        const position = (index / (array.length - 1)) * 100;
        return `${color} ${position}%`;
    }).join(', ');

    const containerStyle = {
        position: 'sticky',
        width: 'fit-content',
        marginTop: '1rem',
        left: (isPortrait ? 'calc(80dvw - 7rem)' : 'calc(80% + 1rem)'),
    }

    const gradientStyle = {
        background: `linear-gradient(to right, ${gradient})`,
        color: theme.palette.text.primary,
        border: `1px solid ${theme.palette.text.primary}`,
        minWidth: '150px',
        height: '1.1rem',
        maxHeight: '1.25rem',
        display: 'flex',
        justifyContent: 'space-between',
    };

    const labelStyle = {
        position: 'relative',
        top: '-1.15rem',
        fontSize: '0.8rem',
    };

    return (
        <Box style={containerStyle}>
            <Box style={gradientStyle}>
                <span style={labelStyle}>{valueRange.min}</span>
                <span style={labelStyle}>{valueRange.max}</span>
            </Box>
        </Box>
    );
};

// Function to return an array of STEPS discrete colors in a gradient from startColor and endColor
const generateColorGradient = (startColor, endColor, steps) => {
    function hexToRgb(hex) {
        // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
        const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
        hex = hex.replace(shorthandRegex, function (m, r, g, b) {
            return r + r + g + g + b + b;
        });

        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)]
            : [null, null, null];
    }

    function rgbToHex(r, g, b) {
        return "#" + [r, g, b].map(x => {
            const hex = x.toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        }).join('');
    }

    function interpolateColor(color1, color2, factor) {
        let result = color1.slice();
        for (let i = 0; i < 3; i++) {
            result[i] = Math.round(result[i] + factor * (color2[i] - color1[i]));
        }
        return result;
    }

    let startRGB = hexToRgb(startColor);
    let endRGB = hexToRgb(endColor);
    let colorArray = [];

    for (let i = 0; i < steps; i++) {
        let factor = i / (steps - 1);
        let interpolatedColor = interpolateColor(startRGB, endRGB, factor);
        colorArray.push(rgbToHex(...interpolatedColor));
    }

    return colorArray;
}