
export const getDateRangeForCalendarChart = (dateStrings) => {
  return {
    min: dateStrings.reduce((min, current) => (current < min ? current : min)),
    max: dateStrings.reduce((max, current) => (current > max ? current : max))
  }
};

export const getValueRangeForCalendarChart = (values) => {
  return { min: Math.min(...values), max: Math.max(...values) };
};

export const getCalendarChartMargin = (isPortrait) => {
  return isPortrait
    ? { top: 50, right: 0, bottom: 0, left: 20 }
    : { top: 50, right: 40, bottom: 0, left: 40 };
};

export const calculateCalendarChartHeight = (yearRange, yearHeight, calendarChartMargin) => {
  const numberOfYears = yearRange[1] - yearRange[0] + 1;
  /**
   * The height of the calendar chart's container should be made to fit at least two years of data
   * This way, even if the yearRange (from the slider) is < 2 years, and the following subcharts
   * don't make use of this yearRange (since they have <= 2 years of data), they will still render properly
   */
  const minYearsForHeightCalculation = 2;

  return Math.max(numberOfYears, minYearsForHeightCalculation) * (yearHeight + YEAR_SPACING) + calendarChartMargin.top + calendarChartMargin.bottom;
};

export const calculateValueRange = (data) => {
  const values = data.map((item) => item.value);
  return { min: Math.min(...values), max: Math.max(...values) };
};
export const YEAR_SPACING = 40;

