/* eslint-disable */

// Function to generate a random ID for the google chart container
export const generateRandomID = () => {
  return Math.random().toString(36).substr(2, 9); // Generates a random string of length 9
}

// -------- Chart options --------

const hideAnnotations = {
  stem: {
    length: 0,
  },
  textStyle: {
    opacity: 0,
  },
  boxStyle: null,
};

const returnResponsiveFontSizeInPixels = ({ isSmall, tinyFont }) => {
  return (
    tinyFont ? (isSmall ? 7 : 10) : (isSmall ? 9 : 12)
  );
}

export const returnGenericOptions = (props) => {
  const { chartData, subchartIndex, isSmall, theme } = props;

  // Define some shared styling rules for the chart
  const axisTitleTextStyle = {
    italic: false,
    bold: true,
    color: theme.palette.chart.axisTitle,
    fontSize: returnResponsiveFontSizeInPixels({ isSmall })
  };
  const axisTextStyle = {
    color: theme.palette.chart.axisText,
    bold: isSmall,
    fontSize: returnResponsiveFontSizeInPixels({ isSmall })
  };
  const legendTextStyle = {
    color: theme.palette.chart.axisText,
    fontSize: returnResponsiveFontSizeInPixels({ isSmall })
  };

  // ---- Formulate the options for this specific chart:
  // 1. Populate first with subchart's options (if any)
  let options = chartData.subcharts?.[subchartIndex]?.options
    ? { ...chartData.subcharts[subchartIndex].options }
    : {};

  // 2. Append own chart's options and then populate with universal options for all charts
  options = {
    ...options,
    ...chartData.options,
    theme: 'material',
    curveType: options.curveType || chartData.options?.curveType || 'function',
    crosshair: { orientation: 'both', trigger: 'focus', opacity: 0.5 },
    backgroundColor: { fill: chartData.options?.backgroundColor?.fill || 'transparent' },
    chartArea: {
      ...chartData.options?.chartArea,
      right: isSmall ? 10 : 0,
      left: isSmall ? (chartData?.chartType !== "ScatterChart" ? 30 : 45) : 80,
      top: isSmall ? 40 : 60,
      bottom: chartData?.chartType === "ScatterChart" ? 60 : (isSmall ? 80 : 100)
    },
    width: isSmall ? (chartData.options?.width?.portrait || '100%') : (chartData.options?.width?.landscape || '100%'),
    height: chartData.height || '100%',
    tooltip: {
      isHtml: true,
      showColorCode: false
    },
    legend: {
      alignment: 'center',
      position:
        chartData.options?.legend?.position
        ?? 'top',
      scrollArrows: {
        activeColor: theme.palette.chart.axisTitle,
        inactiveColor: theme.palette.text.secondary,
      },
      pagingTextStyle: {
        fontSize: returnResponsiveFontSizeInPixels({ isSmall, tinyFont: true }),
        color: theme.palette.chart.axisTitle
      }
    }
  };

  // 3. Append to vAxis and hAxis properties
  options.vAxis = {
    ...options.vAxis,
    format: options.vAxis?.format ?? 'decimal',
    title:
      options.vAxis?.title &&
        (chartData?.chartType === "ScatterChart" || !isSmall)
        ? options.vAxis.title
        : null,
    viewWindow: {
      min: options.vAxis?.viewWindow?.min ?? 0,
      max: options.vAxis?.viewWindow?.max ?? null
    }
  };
  options.hAxis = {
    ...options.hAxis,
    title: options.hAxis?.title ?? '',
  };
  // 3.1. If in portrait mode, slant the text of the hAxis
  if (isSmall) {
    options.hAxis = {
      ...options.hAxis,
      slantedText: true,
      slantedTextAngle: 30,
    };
  }

  // 4. Override with custom colors:
  // 4.1. Color scheme of all the series of this chart
  if (typeof options.colors === 'string' || !options.colors) options.colors = theme.palette.chart.optionsColors[options.colors || 'multiColor'];
  // 4.2. Individual color of a single serie (if given)
  if (options.series) {
    Object.values(options.series).forEach((_serie) => {
      const serie = _serie;
      if (serie.color === 'default') {
        serie.color = theme.palette.primary.main;
      }
    });
  }
  // 4.3. Color of the trendline
  if (options.trendlines) {
    options.trendlines.forEach((_item) => {
      const item = _item;
      item.color = theme.palette.primary.main;
    });
  }
  // 4.4. Color axis of the Calendar chart
  if (options.colorAxis) {
    switch (options.colorAxis.colors) {
      case 'matchingColor':
        options.colorAxis.colors = [
          theme.palette.chart.colorAxisFirstColor,
          theme.palette.chart.optionsColors.multiColor[options.colorAxis.colorIndex],
        ];
        break;
      case 'default':
        options.colorAxis.colors = [
          theme.palette.chart.colorAxisFirstColor,
          theme.palette.NYUpurple,
        ];
        break
      // If not any of the above, then the colorAxis should be from the chart (aqi/temperature/humidity...)
      default:
        try {
          options.colorAxis = theme.palette.chart.colorAxes[options.colorAxis.colors]
        } catch {
          options.colorAxis = []
        }
        break;
    }
  }
  // 4.5. Colors of other elements of the chart (typographies and gridlines)
  options.vAxis = {
    ...options.vAxis,
    titleTextStyle: axisTitleTextStyle,
    textStyle: axisTextStyle,
    gridlines: {
      ...options.vAxis?.gridlines,
      color: options.vAxis?.gridlines?.color || theme.palette.chart.gridlines
    },
    minorGridlines: { count: 0 },
  };
  options.hAxis = {
    ...options.hAxis,
    titleTextStyle: axisTitleTextStyle,
    textStyle: axisTextStyle,
    gridlines: {
      ...options.hAxis?.gridlines,
      color: options.hAxis?.gridlines?.color || theme.palette.chart.gridlines
    },
    minorGridlines: {
      ...options.hAxis?.minorGridlines,
      color: options.hAxis?.gridlines?.color || theme.palette.chart.gridlines,
    },
  };
  options.legend = {
    ...options.legend,
    textStyle: legendTextStyle,
  };
  options.annotations = {
    ...options.annotations,
    highContrast: true,
    textStyle: {
      color: theme.palette.primary.contrastText,
      fontSize: returnResponsiveFontSizeInPixels({ isSmall, tinyFont: true }),
      opacity: 0.8
    },
    stem: {
      ...options.annotations?.stem,
      color: theme.palette.chart.axisTitle,
      thickness: 2
    },
    boxStyle: {
      rx: theme.shape.borderRadius, // rounded corners
      ry: theme.shape.borderRadius,
      fill: theme.palette.chart.annotationBoxFill,
      fillOpacity: 0.5
    },
  };

  if (isSmall && chartData?.chartType === "LineChart") {
    options.pointSize = 0;
  }

  return options;
}

export const returnChartControlUI = (props) => {
  const { chartControl, mainChartData, mainChartOptions, subchartIndex, theme, isSmall } = props;
  let chartControlUI = {
    ...chartControl.options?.ui,
    snapToData: true
  };

  // Assign the appropriate UI for chartControl based on controlType (if existed)
  if (chartControl.controlType === 'ChartRangeFilter') {
    chartControlUI = {
      ...chartControlUI,
      chartType: mainChartData.chartType,
      chartView: {
        columns:
          mainChartData.columns
          || (mainChartData.subcharts
            && mainChartData.subcharts[subchartIndex].columns)
          || null
          || null,
      },
      chartOptions: {
        ...mainChartOptions,
        chartArea: {
          ...mainChartOptions.chartArea,
          top: 0,
          bottom: 0
        },
        hAxis: {
          ...mainChartOptions.hAxis,
          textPosition: 'none',
          title: null
        },
        vAxis: {
          ...mainChartOptions.vAxis,
          title: null
        },
        annotations: hideAnnotations,
        legend: null,
        pointSize: 0
      }
    };
  }
  return chartControlUI;
}

export const addTouchEventListenerForChartControl = ({ controlWrapper, chartID }) => {
  const touchHandler = (event) => {
    var touches = event.changedTouches,
      first = touches[0],
      type = '';

    switch (event.type) {
      case 'touchstart':
        type = 'mousedown';
        break;
      case 'touchmove':
        type = 'mousemove';
        break;
      case 'touchend':
        type = 'mouseup';
        break;
      default:
        return;
    }

    var simulatedEvent = new MouseEvent(type, {
      bubbles: true,
      cancelable: true,
      view: window,
      detail: 1,
      screenX: first.screenX,
      screenY: first.screenY,
      clientX: first.clientX,
      clientY: first.clientY,
      button: 0, // left button
      relatedTarget: null,
    });

    first.target.dispatchEvent(simulatedEvent);
    event.preventDefault();
  }

  let isMounted = true; // Flag to track component's mount status
  if (!controlWrapper) return;

  const controlDOM = document.querySelector(`#other-chart-control-${chartID}`);
  if (!controlDOM) return;

  ['touchstart', 'touchmove', 'touchend', 'touchcancel']
    .forEach((touchEvent) => {
      controlDOM.addEventListener(touchEvent, touchHandler, { capture: true });
    });

  return () => {
    isMounted = false; // Component is unmounting

    ['touchstart', 'touchmove', 'touchend', 'touchcancel'].forEach((touchEvent) => {
      controlDOM.removeEventListener(touchEvent, touchHandler, { capture: true });
    });
  };
}