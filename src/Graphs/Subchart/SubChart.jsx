/* eslint-disable */

import { useContext, useEffect, useMemo, useState, useCallback } from 'react';

import { GoogleContext } from '../../ContextProviders/GoogleContext';

import { Box, Grid, Stack } from '@mui/material/';

import { useTheme } from '@mui/material/styles';
import SeriesSelector from './SubchartUtils/SeriesSelector';
import { generateRandomID, returnGenericOptions, returnChartControlUI, addTouchEventListenerForChartControl } from '../GoogleChartHelper';

import GoogleChartStyleWrapper from './SubchartUtils/GoogleChartStyleWrapper';

import LoadingAnimation from '../../Components/LoadingAnimation';

import NivoCalendarChart from './NivoCharts/NivoCalendarChart/NivoCalendarChart';
import { generateSvgFillGradient, BackgroundGradient } from '../../Utils/Gradient/GradientUtils';

import CustomDateRangePicker from '../../Components/DateRangePicker/CustomDateRangePicker'
import { isValidArray } from '../../Utils/UtilFunctions';
import { returnSelectedDataType } from '../../Utils/AirQuality/DataTypes';

import AxesPicker from '../../Components/AxesPicker/AxesPicker';

import NoChartToRender from './NoChartToRender';
import { PREDEFINED_TIMERANGES } from '../../Components/TimeRange/TimeRangeUtils';
import TimeRangeSelectorWrapperForDataHook from '../../Components/TimeRange/TimeRangeSelectorWrapperForDataHook';

export default function SubChart(props) {
  // Props
  const { chartData, subchartIndex, windowSize, isPortrait, height, maxHeight, selectedDataType, allowedDataTypes } = props;

  // Use GoogleContext for loading and manipulating the Google Charts
  const google = useContext(GoogleContext);

  // States of the Google Charts
  const [dataTable, setDataTable] = useState();
  const [chartWrapper, setChartWrapper] = useState();
  const [controlWrapper, setControlWrapper] = useState();

  const [previousChartData, setPreviousChartData] = useState();

  // Get the current theme
  const theme = useTheme();

  // To determine the first time the chart renders to show/hide the LoadingAnimation
  const [isFirstRender, setIsFirstRender] = useState(true);

  // To determine if the charts should be rendered or not
  const [shouldRenderChart, setShouldRenderChart] = useState(true);
  const [renderChartNow, setRenderChartNow] = useState(false);

  // Keep track of the columns (series) of the chart
  const [allInitialColumns, setAllInitialColumns] = useState();
  const [dataColumns, setDataColumns] = useState();
  const [initialVAxisRange, setInitialVAxisRage] = useState();

  // Define the DOM container's ID for drawing the google chart inside
  const [chartID, __] = useState(generateRandomID());

  // Get the options object for chart
  const options = useMemo(() => {
    return returnGenericOptions({ ...props, theme });
  }, [props, theme, chartData.chartType]);

  // State to store transformed data for CalendarChart
  const [calendarDataArray, setCalendarDataArray] = useState(null);

  // Early exit for 'Calendar' chartType
  if (chartData.chartType === 'Calendar') {
    useEffect(() => {
      const dataArray = chartData.dataArray
        || (chartData.subcharts
          && chartData.subcharts[subchartIndex].dataArray)
        || null
        || null;

      if (!isValidArray(dataArray)) {
        setShouldRenderChart(false);
        return; // early return if there is no data to render
      }

      setCalendarDataArray(dataArray)
      setShouldRenderChart(true);
    }, [chartData]);

    if (!calendarDataArray) {
      return (
        <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
          <LoadingAnimation />
        </Box>
      )
    }

    return (
      shouldRenderChart ? (
        <NivoCalendarChart
          dataArray={calendarDataArray}
          valueRangeBoxTitle={returnSelectedDataType({ dataTypeKey: selectedDataType, dataTypes: allowedDataTypes, showUnit: true })}
          isPortrait={isPortrait}
          options={options}
          windowSize={windowSize}
        />
      ) : (
        <>
          <NoChartToRender dataType={returnSelectedDataType({ dataTypeKey: selectedDataType, dataTypes: allowedDataTypes })} />
          <NivoCalendarChart
            dataArray={[]}
            valueRangeBoxTitle={returnSelectedDataType({ dataTypeKey: selectedDataType, dataTypes: allowedDataTypes, showUnit: true })}
            isPortrait={isPortrait}
            options={options}
            windowSize={windowSize}
          />
        </>
      )
    );
  }

  // Properties for chart control (if existed)
  let hasChartControl = false;
  let chartControlOptions;
  // Only show the chart control if:
  // It exists in the database (either for all subcharts or just for a particular subchart)
  // And if the chart is currently not shown on homePage
  let chartControl = chartData.control || chartData.subcharts?.[subchartIndex].control;
  if (chartControl) {
    hasChartControl = true;

    // Get the options for chartControl if hasChartControl
    chartControlOptions = {
      ...chartControl.options,
      ui: returnChartControlUI({
        chartControl,
        mainChartData: chartData,
        mainChartOptions: options,
        subchartIndex,
        theme,
        isPortrait
      })
    };

    // Swap touch events for mouse events on ChartRangeControl
    // as it doesn't support touch events on mobile
    if (chartControl.controlType === 'ChartRangeFilter') {
      useEffect(() => {
        const cleanupTouchEventListener = addTouchEventListenerForChartControl({ controlWrapper, chartID });
        return cleanupTouchEventListener;
      }, [controlWrapper]);
    }
  }

  // Properties for selecting (showing or hiding) the serie(s)
  const seriesSelector = options.seriesSelector || false;

  // Properties for date-range-picker and time range selector
  const dateRangePicker = options.dateRangePicker || null;
  const timeRangeSelector = options.timeRangeSelector || null;

  // Properties for data formatters
  const formatters = options.formatters || null;

  // Properties for selectableAxes
  let selectableAxes = chartData.selectableAxes || null;
  if (selectableAxes) {
    if (isValidArray(selectableAxes.allowedAxes)) {
      if (selectableAxes.allowedAxes.length <= 2) selectableAxes = null; // don't display selectableAxes if number of allowedSensors is less than 3
    }
  }

  const hasAtLeastOneAuxillaryControl = seriesSelector || dateRangePicker || selectableAxes || timeRangeSelector;

  // Set new options prop and re-render the chart if theme or isPortrait changes
  useEffect(() => {
    if (seriesSelector) handleSeriesSelection({ newDataColumns: dataColumns }); // this function set new options, too
    else {
      chartWrapper?.setOptions({
        ...options
      });

      chartWrapper?.draw();
      if (hasChartControl) {
        controlWrapper?.setOptions(chartControlOptions);
        controlWrapper?.draw();
      }
    }
  }, [theme, isPortrait, windowSize]);

  // Set new initialColumnsColors if the theme changes
  // This only applies to when seriesSelector.method == "setViewColumn"
  useEffect(() => {
    if (!dataColumns) return;
    if (seriesSelector && seriesSelector.method == "setViewColumn") {
      setInitialColumnsColors({ dataColumns: dataColumns });
      handleSeriesSelection({ newDataColumns: dataColumns });
    }
  }, [theme]);

  const getInitialColumns = ({ chartWrapper, dataTable, seriesSelector }) => {
    const prevSelections = dataColumns?.map(c => ({ label: c.label, selected: c.selected })) || [];

    // Update the initial DataView's columns (often, all of the series are displayed initially)
    // If (optional) columns is not specified in database
    // Assign it from DataTable
    let initialView = chartWrapper.getView();
    if (initialView.columns == null) {
      const viewFromDataTable = new google.visualization.DataView(dataTable);
      chartWrapper.setView({ columns: viewFromDataTable.columns });
      initialView = chartWrapper.getView();
    }

    let shouldAssignDomainRoleToFistColumn = true; // variable to only assign type: 'domain' to the very first column
    let dataSeriesIndex = 0;

    const allInitialColumns = initialView.columns.map((col, index) => {
      // A column can either be a number (that denotes the index of the sourceColumn) or an object
      // The code below harmonize all columns to be an object to store crucial data to toggle their visibility
      if (typeof col === 'number') {
        col = {
          role: shouldAssignDomainRoleToFistColumn ? 'domain' : 'data',
          sourceColumn: col,
        };
      }

      col.label = dataTable.getColumnLabel(col.sourceColumn);
      col.indexInAllInitialColumns = index;
      shouldAssignDomainRoleToFistColumn = false;

      // Set the visibility of data column, 
      if (col.role === 'data') {
        // First, try to restore previous selection by label
        const prev = prevSelections.find(p => p.label === col.label);
        if (prev) {
          col.selected = prev.selected;
        } else {
          // Else, fallback to default logic if new series or first load (if defaultSeriesToDisplayInitially is available)
          if (seriesSelector.defaultSeriesToDisplayInitially) {
            col.selected = seriesSelector.defaultSeriesToDisplayInitially.includes(index);
          }
          // Else of no defaultSeriesToDisplayInitially is presented, then, all data columns are selected if multiple series are selectable
          else if (seriesSelector.allowMultiple) {
            col.selected = true;
          } else {
            // Else, for single serie selector, only first data column is selected
            col.selected = (dataSeriesIndex === 0);
          }
        }
        col.seriesIndex = dataSeriesIndex;
        dataSeriesIndex++;
      }

      return col;
    });

    setAllInitialColumns(allInitialColumns);

    const initialVAxisRange = getInitialVAxisRange({ dataTable, allInitialColumns });
    setInitialVAxisRage(initialVAxisRange);

    const dataCols = allInitialColumns.filter(col => col.role === 'data' && options.series?.[col.seriesIndex]?.visibleInLegend !== false);

    if (seriesSelector.method === "setViewColumn") setInitialColumnsColors({ dataColumns: dataCols });

    setDataColumns(dataCols);

    return { initAllInitialColumns: allInitialColumns, initDataColumns: dataCols };
  };


  const setInitialColumnsColors = ({ dataColumns }) => {
    dataColumns.forEach((col) => {
      // Assign inherit color to this data column
      col.color = options.colors[col.seriesIndex % options.colors.length];
      // Assign other inherit attributes from its serie object (if existed)
      col.serieAttribute = options.series?.[col.seriesIndex];
    });
  }

  const getInitialVAxisRange = ({ dataTable, allInitialColumns }) => {
    let vAxisMin, vAxisMax;
    allInitialColumns.forEach((col, index) => {
      if (index === 0) return; // the first column is the domain (hAxis)
      const range = dataTable.getColumnRange(col.sourceColumn);
      if (!isNaN(range.min) && range.min) vAxisMin = vAxisMin ? Math.min(vAxisMin, range.min) : range.min;
      if (!isNaN(range.max) && range.max) vAxisMax = vAxisMax ? Math.max(vAxisMax, range.max) : range.max;
    });
    return { min: vAxisMin, max: vAxisMax };
  }

  const handleSeriesSelection = useCallback(({
    newDataColumns,
    _allInitialColumns = allInitialColumns,
    _chartWrapper = chartWrapper,
    _controlWrapper = controlWrapper
  }) => {
    if (!_allInitialColumns) return;

    setDataColumns(newDataColumns);

    if (seriesSelector.method === "toggleVisibility" || seriesSelector.method === null) {
      const hiddenSeriesObject = {};
      newDataColumns.forEach((col) => {
        if (!col.selected)
          hiddenSeriesObject[col.seriesIndex] = {
            color: 'transparent',
            enableInteractivity: false,
            visibleInLegend: false
          }; // 'hide' the serie by making it transparent
      });

      _chartWrapper?.setOptions({
        ...options,
        series: {
          ...options.series,
          ...hiddenSeriesObject
        }
      });

      if (hasChartControl) {
        const currentControlOptions = _controlWrapper?.getOptions();
        _controlWrapper?.setOptions({
          ...currentControlOptions,
          ui: {
            ...currentControlOptions.ui,
            chartOptions: {
              ...currentControlOptions.ui.chartOptions,
              series: {
                ...options.series,
                ...hiddenSeriesObject
              }
            }
          }
        });
      }
    }
    else if (seriesSelector.method === "setViewColumn") {
      let newViewColumns = [];
      newViewColumns.push(0); // this is the domain column
      newDataColumns.forEach((dataColumn) => {
        if (dataColumn.selected) {
          newViewColumns.push(dataColumn);
          // Find this dataColumn's supporting columns (whose role !== 'data')
          // A dataColumn has its supporting columns (can be many) follow it immediately
          if (isValidArray(_allInitialColumns)) {
            for (let i = dataColumn.indexIn_ + 1; i < _allInitialColumns.length; i++) {
              if (_allInitialColumns[i].role !== 'data') {
                newViewColumns.push(_allInitialColumns[i]);
              }
              // If this loop encounter the next dataColumn, break the loop, all supporting columns for this dataColumn have been discovered
              else {
                break;
              }
            }
          }
        }
      });
      _chartWrapper?.setView({ columns: newViewColumns });

      const newOptions = { ...options };
      // Preserve the initial vAxis range so that the vAxis doesn't shift based on the visible serie(s)
      // newOptions.vAxis.viewWindow = {
      //   min: (options.vAxis.viewWindow.min == null) ? initialVAxisRange.min : options.vAxis.viewWindow.min,
      //   max: (options.vAxis.viewWindow.max == null) ? initialVAxisRange.max : options.vAxis.viewWindow.max,
      // }
      // Set the new color array
      newOptions.colors = newDataColumns.filter((col) => col.selected).map((col) => col.color);
      // Set the new series object (if any)
      // this contains other series' attributes (lineWidth, seriesType...)
      const series = {};
      let selectedSeriesCount = 0;
      newDataColumns.forEach((col) => {
        if (!col.selected) return;
        if (col.serieAttribute != null) {
          series[selectedSeriesCount] = col.serieAttribute;
        }
        selectedSeriesCount++;
      })
      newOptions.series = series;
      _chartWrapper?.setOptions(newOptions);

      if (hasChartControl) {
        const currentControlOptions = _controlWrapper?.getOptions();
        _controlWrapper?.setOptions({
          ...currentControlOptions,
          ui: {
            ...currentControlOptions.ui,
            chartOptions: {
              ...currentControlOptions.ui.chartOptions,
              colors: newOptions.colors,
              series: newOptions.series
            },
            chartView: {
              columns: newViewColumns
            }
          }
        });
      }
    }

    // Call draw to apply the new DataView and 'refresh' the chart
    _chartWrapper?.draw();

    if (hasChartControl) {
      _controlWrapper?.draw();
    }
  }, [allInitialColumns, options, seriesSelector, chartWrapper, controlWrapper, initialVAxisRange, hasChartControl]);

  const reconstructFunctionFromJSONstring = (columns) => {
    if (!columns) return;

    const evaluatedColumns = [];
    for (const column of columns) {
      if (typeof column === 'number') {
        // If it's a number, add it as-is
        evaluatedColumns.push(column);
      } else if (typeof column === 'object') {
        if (column.calc && column.calc !== 'stringify') {
          // If it's an object with a 'calc' property, evaluate the 'calc' function
          // using new Function() and add the result to the evaluatedColumns array
          const calcFunction = new Function("dataTable", "rowNum", column.calc);
          evaluatedColumns.push({
            ...column,
            calc: calcFunction,
          });
        } else {
          // If it's an object without a 'calc' property, or with calc = 'stringify', add it as-is
          evaluatedColumns.push(column);
        }
      }
    }
    return evaluatedColumns;
  }

  // Prepare to draw the chart if there is any change in chartData
  // but only set flag renderChartNow if the chart should draw in the next rendering cycle
  // to prevent chartID container not being mounted on time
  useEffect(() => {
    if (google && chartData) {
      // Do not draw again if deep comparison between current chartData and previousChartData is true
      if (JSON.stringify(chartData) === JSON.stringify(previousChartData)) return;
      setPreviousChartData(chartData);

      // Get and set the dataArray 
      const dataArray = chartData.dataArray
        || (chartData.subcharts
          && chartData.subcharts[subchartIndex].dataArray)
        || null
        || null;

      const _shouldRenderChart = isValidArray(dataArray);
      setShouldRenderChart(_shouldRenderChart);
      if (_shouldRenderChart === true) {
        setRenderChartNow(true);
        const dataTable = google.visualization.arrayToDataTable(dataArray);

        // Call functions for formatting the number if numberFormat/dateFormat is specified 
        if (formatters && typeof formatters === 'object') {
          if (formatters.hasOwnProperty("numberFormatter")) {
            const numberFormat = new google.visualization.NumberFormat(formatters.numberFormatter.numberFormat);
            formatters.numberFormatter.columns.forEach(col => numberFormat.format(dataTable, col));
          }
        }
        setDataTable(dataTable);
      }
    }
  }, [google, chartData]);

  // Actually draw the chart now because chartID container is already mounted from shouldRenderChart flag
  useEffect(() => {
    if (renderChartNow === true) {
      // Get dataColumn views
      const columns = chartData.columns
        || (chartData.subcharts
          && chartData.subcharts[subchartIndex].columns)
        || null
        || null;
      const reconstructedColumns = reconstructFunctionFromJSONstring(columns);

      // Create chartWrapper
      const thisChartWrapper = new google.visualization.ChartWrapper({
        chartType: chartData.chartType,
        dataTable: (!hasChartControl) ? dataTable : undefined,
        options: options,
        view: {
          columns: reconstructedColumns
        },
        containerId: chartID
      });
      setChartWrapper(thisChartWrapper);

      let thisControlWrapper;
      if (hasChartControl) {
        const thisDashboardWrapper = new google.visualization.Dashboard(
          document.getElementById(`dashboard-${chartID}`));

        google.visualization.events.addListener(thisDashboardWrapper, 'ready', onChartReady);

        thisControlWrapper = new google.visualization.ControlWrapper({
          controlType: chartControl.controlType,
          options: chartControlOptions,
          containerId: `${chartControl.controlType === "CategoryFilter" ? "CategoryFilter" : "other-chart-control"}-${chartID}`
        });
        setControlWrapper(thisControlWrapper);

        // Establish dependencies
        thisDashboardWrapper.bind(thisControlWrapper, thisChartWrapper);

        thisDashboardWrapper.draw(dataTable);
      }
      else {
        google.visualization.events.addListener(thisChartWrapper, 'ready', onChartReady);
        thisChartWrapper.draw();
      }

      // Run the seriesSelector for the first time
      if (seriesSelector) {
        const { initAllInitialColumns, initDataColumns } = getInitialColumns({ chartWrapper: thisChartWrapper, dataTable: dataTable, seriesSelector: seriesSelector });
        handleSeriesSelection({
          _allInitialColumns: initAllInitialColumns,
          newDataColumns: initDataColumns,
          _chartWrapper: thisChartWrapper,
          _controlWrapper: thisControlWrapper
        });
      }

      setRenderChartNow(false);
    }
  }, [renderChartNow])

  const renderChart = () => {
    return (
      <Grid id={`dashboard-${chartID}`} container alignItems="start">
        {hasAtLeastOneAuxillaryControl && (
          <Grid lg={2} container item
            sx={{
              mt: 1,
              ml: 2,
              gap: 2,
              [theme.breakpoints.down('lg')]: { gap: 1, ml: 0 }
            }}
          >
            {
              isFirstRender === false && (
                <>
                  {seriesSelector &&
                    <Grid item xs="auto" lg={12}
                      sx={{
                        [theme.breakpoints.down('sm')]: { width: '100%' }
                      }}
                    >
                      <SeriesSelector
                        items={dataColumns}
                        allowMultiple={seriesSelector.allowMultiple}
                        seriesLabel={seriesSelector.seriesLabel}
                        selectorID={`${chartData.title}-selector`}
                        onSeriesSelection={handleSeriesSelection}
                        displayChip={false}
                      />
                    </Grid>
                  }

                  {
                    dateRangePicker &&
                    <CustomDateRangePicker
                      minDateOfDataset={new Date(dateRangePicker.minDate)}
                      chartIndex={chartData.id}
                    />
                  }

                  {selectableAxes &&
                    <AxesPicker
                      chartID={chartData.id}
                      allowedAxes={selectableAxes.allowedAxes}
                      selectedAxes={selectableAxes.selectedAxes}
                      dataType={selectedDataType}
                    />
                  }

                  {
                    timeRangeSelector &&
                    <Grid item xs="auto" lg={12}
                      sx={{
                        [theme.breakpoints.down('sm')]: { width: '100%' }
                      }}
                    >
                      <TimeRangeSelectorWrapperForDataHook
                        defaultTimeRange={[PREDEFINED_TIMERANGES.allday.start, PREDEFINED_TIMERANGES.allday.end]}
                        handleChange={() => {
                          return null;
                        }}
                        isResponsive
                        hasTitle
                        chartIndex={chartData.id}
                      />
                    </Grid>
                  }
                </>
              )
            }

            <Grid item xs="auto" lg={12}
              sx={{
                [theme.breakpoints.down('sm')]: { width: '100%' }
              }}
            >
              {/* Special div for CategoryFilter to align its position with other auxillary controls */}
              <Box
                id={`CategoryFilter-${chartID}`} sx={{
                  display: hasChartControl && chartControl.controlType === 'CategoryFilter' ? "block" : "none"
                }} />
            </Grid>
          </Grid>
        )}

        <Grid item xs>
          <Stack>
            <Box
              id={chartID}
              sx={{ height: height, maxHeight: maxHeight }}
            />

            {/* Div for all other types of chart control */}
            <Box
              id={`other-chart-control-${chartID}`}
              sx={{
                display: (hasChartControl && chartControl.controlType !== 'CategoryFilter') ? "block" : "none",
                height: `calc(${height} / 8)`,
                filter: 'saturate(0.3)',
                opacity: 0.7
              }}
            />
          </Stack>
        </Grid>
      </Grid>
    )
  };

  // Generate the gradient background if it exists in options parameter
  const gradientBackgroundColor = options.gradientBackgroundColor;
  let gradientBackgroundId, svgFillGradient;
  if (gradientBackgroundColor) {
    gradientBackgroundId = `${chartID}-backgroundGradient`;
    svgFillGradient = generateSvgFillGradient({
      colors: theme.palette.chart.colorAxes[gradientBackgroundColor].colors,
      optionalMinValue: options.vAxis?.viewWindow?.min,
      optionalMaxValue: options.vAxis?.viewWindow?.max
    });
  }

  const onChartReady = () => {
    if (!isFirstRender) return;
    // Hide the circleProgress when chart finishes rendering the first time
    setIsFirstRender(false);
  };

  const showAuxiliaryControls = () => {
    if (!isFirstRender) {
      return (
        <>

        </>
      );
    } else {
      return null;
    }
  };

  return (
    shouldRenderChart ?
      (
        <GoogleChartStyleWrapper
          isPortrait={isPortrait}
          gradientBackgroundId={gradientBackgroundId}
          className={chartData.chartType}
          position="relative"
          height="100%"
          minHeight={chartData.chartType === 'Calendar' && '200px'}
        >
          {/* Conditionally display loading animation here */}
          {isFirstRender && (
            <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
              <LoadingAnimation />
            </Box>
          )}
          {renderChart()}
          {gradientBackgroundColor ? <BackgroundGradient id={gradientBackgroundId} colors={svgFillGradient} /> : null}
        </GoogleChartStyleWrapper>
      ) :
      (
        <NoChartToRender
          dataType={returnSelectedDataType({ dataTypeKey: selectedDataType, dataTypes: allowedDataTypes })}
          selectableAxes={selectableAxes}
          // If the visualization has a series selector or control, we need to account for its height
          // And since the height is a string, we need to parse it to a number before adding to it
          height={seriesSelector || hasChartControl ? (parseFloat(height) * 1.2 + 'vw') : height}

        />
      )
  );
}