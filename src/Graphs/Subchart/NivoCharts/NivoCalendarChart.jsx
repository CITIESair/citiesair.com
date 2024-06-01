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
        generateColorGradient(options?.colorAxis?.colors, 100) :
        options?.colorAxis?.colors;

    const showLegend = () => {
        return (
            <ValueRangeBox
                valueRange={valueRange}
                colorAxis={options?.colorAxis}
                isPortrait={isPortrait}
            />
        )
    }

    return (
        <>
            {options?.legend?.position !== "none" && showLegend()}
            {showLegend()}
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

const ValueRangeBox = ({ valueRange, colorAxis, isPortrait }) => {
    if (valueRange?.min === null || valueRange?.max === null) return null;

    const { colors, isGradient, minValue, maxValue } = colorAxis;

    const theme = useTheme();

    // Generate gradient string or discrete colors string
    const backgroundStyle = (() => {
        if (isGradient) {
            if (typeof colors[0] === 'string') {
                // No stops provided, generate equally spaced stops
                return `linear-gradient(to right, ${colors.map((color, index, array) => {
                    const position = (index / (array.length - 1)) * 100;
                    return `${color} ${position}%`;
                }).join(', ')})`;
            } else {
                // Normalize the stops
                const stops = colors.map(cs => cs.stop);
                const minStop = Math.min(...stops);
                const maxStop = Math.max(...stops);
                const normalizedColors = colors.map(cs => ({
                    color: cs.color,
                    stop: ((cs.stop - minStop) / (maxStop - minStop)) * 100
                }));
                return `linear-gradient(to right, ${normalizedColors.map(cs => `${cs.color} ${cs.stop}%`).join(', ')})`;
            }
        } else {
            // Discrete colors without gradient
            return colors.map(color => color.color || color).join(', ');
        }
    })();

    const calculatePosition = (value) => {
        const position = ((value - minValue) / (maxValue - minValue)) * 100;
        return `${position}%`;
    };

    const containerStyle = {
        position: 'sticky',
        width: 'fit-content',
        marginTop: '1.5rem',
        float: 'right',
        right: (isPortrait ? '0' : '5%'),
    };

    const gradientStyle = {
        background: isGradient ? backgroundStyle : undefined,
        color: theme.palette.text.secondary,
        border: `1px solid ${theme.palette.text.secondary}`,
        width: '300px',
        height: '1rem',
        position: 'relative',
        display: isGradient ? 'block' : 'flex',
        justifyContent: 'space-between',
    };

    const discreteBoxStyle = {
        flex: 1,
        height: '100%',
    };

    const labelStyle = {
        position: 'absolute',
        fontSize: '0.75rem',
        color: theme.palette.text.secondary
    };
    const topLabelStyle = {
        top: '-1.5rem',
        transform: 'translateX(-100%)'
    };
    const bottomLabelStyle = {
        bottom: '-1.5rem',
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
        <Box style={containerStyle}>
            <Box style={gradientStyle}>
                {isGradient ? null : colors.map((color, index) => (
                    <Box key={index} style={{ ...discreteBoxStyle, backgroundColor: color.color || color }} />
                ))}
                <span style={{ ...labelStyle, ...topLabelStyle, left: calculatePosition(valueRange.min) }}>min: {valueRange.min}</span>
                <span style={{ ...labelStyle, ...bottomLabelStyle, left: calculatePosition(valueRange.max) }}>max: {valueRange.max}</span>
                <div style={{ ...triangleStyle, ...topTriangleStyle, left: calculatePosition(valueRange.min) }}></div>
                <div style={{ ...triangleStyle, ...bottomTriangleStyle, left: calculatePosition(valueRange.max) }}></div>
            </Box>
        </Box>
    );
};

// Function to return an array of STEPS discrete colors in a gradient from startColor and endColor
const generateColorGradient = (colors, steps) => {
    function hexToRgb(hex) {
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

    function normalizeStops(stops) {
        const minStop = Math.min(...stops);
        const maxStop = Math.max(...stops);
        return stops.map(stop => (stop - minStop) / (maxStop - minStop));
    }

    let colorStops;
    if (typeof colors[0] === 'string') {
        // No stops provided, generate equally spaced stops
        const totalColors = colors.length;
        colorStops = colors.map((color, index) => ({
            color: hexToRgb(color),
            stop: index / (totalColors - 1)
        }));
    } else {
        // Stops are provided, normalize them
        let stops = colors.map(cs => cs.stop);
        stops = normalizeStops(stops);

        colorStops = colors.map((cs, index) => ({
            color: hexToRgb(cs.color),
            stop: stops[index]
        }));
    }

    let colorArray = [];
    let stepPositions = Array.from({ length: steps }, (_, i) => i / (steps - 1));

    for (let i = 0; i < stepPositions.length; i++) {
        let pos = stepPositions[i];
        let color1, color2, stop1, stop2;

        for (let j = 0; j < colorStops.length - 1; j++) {
            if (pos >= colorStops[j].stop && pos <= colorStops[j + 1].stop) {
                color1 = colorStops[j].color;
                color2 = colorStops[j + 1].color;
                stop1 = colorStops[j].stop;
                stop2 = colorStops[j + 1].stop;
                break;
            }
        }

        let localFactor = (pos - stop1) / (stop2 - stop1);
        let interpolatedColor = interpolateColor(color1, color2, localFactor);
        colorArray.push(rgbToHex(...interpolatedColor));
    }

    return colorArray;
}