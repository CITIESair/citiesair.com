/* eslint-disable */
import { ResponsiveCalendar } from '@nivo/calendar';
import { useTheme } from '@mui/material/styles';
import { generateDiscreteColorGradientArray } from '../../../../Utils/Gradient/GradientUtils';

import ValueRangeBox from './ValueRangeBox';
import TooltipCalendarChart from './TooltipCalendarChart';
import YearRangeSlider from './YearRangeSlider';
import { useYearRange } from '../../../../ContextProviders/YearRangeContext';
import { calculateCalendarChartHeight, calculateValueRange, getCalendarChartMargin, getDateRangeForCalendarChart, getValueRangeForCalendarChart } from '../NivoChartHelper';
import { useEffect, useRef, useState } from 'react';
import { isValidArray } from '../../../../Utils/UtilFunctions';
import GoogleChartStyleWrapper from '../../SubchartUtils/GoogleChartStyleWrapper';

const CONTAINER_WIDTH = 1200;

const NivoCalendarChart = (props) => {
    const { dataArray, valueRangeBoxTitle, isPortrait, options } = props;

    const [dateRange, setDateRange] = useState({ min: null, max: null });
    const [valueRange, setValueRange] = useState({ min: null, max: null });

    useEffect(() => {
        if (!isValidArray(dataArray)) return;

        const dateStrings = dataArray.map(item => item.day);
        setDateRange(getDateRangeForCalendarChart(dateStrings));

        const values = dataArray.map(item => item.value);
        setValueRange(getValueRangeForCalendarChart(values));
    }, [dataArray]);

    const [calendarHeight, setCalendarHeight] = useState(600);

    const { yearRange } = useYearRange();

    const calendarChartMargin = getCalendarChartMargin(isPortrait);

    const theme = useTheme();

    // Filter data based on the selected year range
    const filteredData = dataArray.filter(item => {
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

    const calendarCellColors = generateDiscreteColorGradientArray({
        colors: options?.colorAxis?.colors,
        numSteps: options?.colorAxis?.gradientSteps
    });

    const ref = useRef();

    const updateHeight = () => {
        if (!isValidArray(dataArray)) return;

        const calendarChartMargin = getCalendarChartMargin(isPortrait);
        const cellSize = Math.min(CONTAINER_WIDTH / 60, 20); // max cell size of 20
        const yearHeight = cellSize * 7; // Height for one year
        const totalHeight = calculateCalendarChartHeight(yearRange, yearHeight, calendarChartMargin);
        setCalendarHeight(totalHeight);

        if (!ref.current) return;

        let element = ref.current; // Start with the current ref
        let targetElement = null;

        while (element) {
            if (element.classList.contains('MuiBox-root')) {
                let sibling = element.parentElement.firstChild;
                while (sibling) {
                    if (sibling !== element && sibling.classList.contains('MuiTabs-root')) {
                        targetElement = element; // Found the target element
                        break;
                    }
                    sibling = sibling.nextSibling;
                }
            }

            if (targetElement) break;
            element = element.parentElement;
        }

        if (targetElement) {
            targetElement.style.height = `${totalHeight + 125}px`;
        }
    };

    // Debounce function to prevent ResizeObserver loop
    // (from MUI Slider) from crashing the app
    const debounce = (func, wait) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    };

    const debouncedUpdateHeight = debounce(updateHeight, 20);

    useEffect(() => {
        debouncedUpdateHeight();
    }, [yearRange, isPortrait]);

    return (
        <>
            <YearRangeSlider
                dateRange={dateRange}
                isPortrait={isPortrait}
            />

            {options?.legend?.position === "none" ? null : (
                <ValueRangeBox
                    title={valueRangeBoxTitle}
                    valueRange={valueRange}
                    filteredValueRange={filteredValueRange}
                    colorAxis={options?.colorAxis}
                    isPortrait={isPortrait}
                />
            )}

            <GoogleChartStyleWrapper
                ref={ref}
                isPortrait={isPortrait}
                className="Calendar"
                position="relative"
                minWidth="700px"
                height={calendarHeight + 'px'}
                minHeight={isPortrait ? '200px' : calendarHeight + 'px'}
            >
                <ResponsiveCalendar
                    data={dataArray}
                    from={`${yearRange[0]}-01-01`}
                    to={`${yearRange[1]}-12-31`}
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
                    yearSpacing={40}
                    monthBorderColor={theme.palette.text.primary}
                    monthBorderWidth={1}
                    daySpacing={0.25}
                    dayBorderWidth={0}
                    tooltip={({ day, value, color }) => {
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
            </GoogleChartStyleWrapper>
        </>
    );
};

export default NivoCalendarChart;
