/* eslint-disable */
import { ResponsiveCalendar } from '@nivo/calendar';
import { useTheme } from '@mui/material/styles';
import { generateDiscreteColorGradientArray } from '../../../../Utils/Gradient/GradientUtils';

import ValueRangeBox from './ValueRangeBox';
import TooltipCalendarChart from './TooltipCalendarChart';
import { getCalendarChartMargin, getDateRangeForCalendarChart, getValueRangeForCalendarChart } from '../NivoChartHelper';
import { useEffect, useState } from 'react';
import { isValidArray } from '../../../../Utils/UtilFunctions';
import GoogleChartStyleWrapper from '../../SubchartUtils/GoogleChartStyleWrapper';
import { Box, useMediaQuery } from '@mui/material';

const YEAR_SPACING = 40;

const NivoCalendarChart = (props) => {
    const { dataArray, valueRangeBoxTitle, options, windowSize } = props;

    const isSmall = useMediaQuery((theme) => theme.breakpoints.down('sm'));

    const [dateRange, setDateRange] = useState({ min: null, max: null });
    const [valueRange, setValueRange] = useState({ min: null, max: null });
    const [calendarHeight, setCalendarHeight] = useState(400);

    useEffect(() => {
        if (!isValidArray(dataArray)) return;

        const dateStrings = dataArray.map(item => item.day);
        const thisDateRange = getDateRangeForCalendarChart(dateStrings)
        setDateRange(thisDateRange);

        const values = dataArray.map(item => item.value);
        setValueRange(getValueRangeForCalendarChart(values));

        // Get the number of years we have data for and the number of years to display
        const lastYear = new Date(thisDateRange.max).getFullYear();
        const firstYear = new Date(thisDateRange.min).getFullYear();
        const numberOfYears = lastYear - firstYear + 1;
        const calendarChartMargin = getCalendarChartMargin(isSmall);

        const cellSize = Math.min(windowSize[0] / 60, 20); // windowSize[0]: innerWidth
        // max cell size of 20
        const yearHeight = cellSize * 7; // Height for one year
        const totalHeight = numberOfYears * (yearHeight + YEAR_SPACING) + calendarChartMargin.top + calendarChartMargin.bottom;
        setCalendarHeight(totalHeight);
    }, [dataArray, windowSize]);

    const displayLegend = options?.legend?.position && options.legend.position !== "none";

    const calendarChartMargin = getCalendarChartMargin(isSmall, displayLegend);

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

    const calendarCellColors = generateDiscreteColorGradientArray({
        colors: options?.colorAxis?.colors,
        numSteps: options?.colorAxis?.gradientSteps
    });

    return (
        <GoogleChartStyleWrapper
            className="Calendar"
            position="relative"
            minWidth="550px"
            height="100%"
        >
            {displayLegend ? (
                <ValueRangeBox
                    title={valueRangeBoxTitle}
                    valueRange={valueRange}
                    colorAxis={options?.colorAxis}
                />
            ) : null}


            <Box sx={{
                height: `${calendarHeight}px`,
                maxHeight: "600px",
                overflowY: 'auto',
                width: '100%',
                position: 'relative'
            }}>
                <Box sx={{
                    height: `${calendarHeight}px`,
                    position: 'absolute',
                    width: '100%'
                }}>
                    <ResponsiveCalendar
                        data={dataArray}
                        from={dateRange.min}
                        to={dateRange.max}
                        emptyColor="transparent"
                        align="top"
                        theme={{
                            text: {
                                fill: theme.palette.text.secondary,
                            },
                            fontSize: '0.75rem'
                        }}
                        colors={calendarCellColors}
                        minValue={options?.colorAxis?.minValue}
                        maxValue={options?.colorAxis?.maxValue}
                        margin={calendarChartMargin}
                        yearSpacing={YEAR_SPACING}
                        monthBorderColor={theme.palette.text.primary}
                        monthBorderWidth={1}
                        daySpacing={0.25}
                        dayBorderWidth={0}
                        tooltip={({ day, color }) => {
                            const tooltipData = dataArray.find(item => item.day === day);
                            const tooltipText = tooltipData ? extractTooltipText(tooltipData.tooltip) : '';

                            return (
                                <TooltipCalendarChart
                                    day={day}
                                    color={color}
                                    tooltipText={tooltipText}
                                    dateRange={dateRange}
                                    inFirstTwoRowsOfChart={inFirstTwoRowsOfChart}
                                />
                            );
                        }}
                    />
                </Box>
            </Box>

        </GoogleChartStyleWrapper>
    );
};

export default NivoCalendarChart;

