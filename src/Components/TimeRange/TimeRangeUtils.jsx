export const returnHoursFromMinutesPastMidnight = (minutes) => {
  const hoursPastMidnight = Math.floor(minutes / 60);
  return hoursPastMidnight.toString().padStart(2, '0') + ':00';
};

export const HOURS = Array.from({ length: 24 }, (_, i) => {
  const minutesPastMidnight = i * 60;
  return {
    label: returnHoursFromMinutesPastMidnight(minutesPastMidnight),
    value: minutesPastMidnight
  };
});

export const PREDEFINED_TIMERANGES = {
  allday: { id: "allday", label: "All Day", start: HOURS[0].value, end: HOURS[HOURS.length - 1].value, timeRangeLabel: "0-23h" },
  schoolHour: { id: "schoolHour", label: "School Hour", start: HOURS[7].value, end: HOURS[17].value, timeRangeLabel: "7-17h" },
  custom: { id: "custom", label: "Custom" }
};



