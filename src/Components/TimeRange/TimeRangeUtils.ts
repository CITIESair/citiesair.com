export const returnHoursFromMinutesPastMidnight = (minutes: number): string => {
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

/**
 * Predefined time ranges for time selection
 * - allday: Full 24-hour range (0-23h, represented as 0-1380 minutes past midnight)
 * - schoolHour: School hours range (7-17h, represented as 420-1020 minutes past midnight)
 * - custom: User-defined custom range (no predefined start/end)
 */
export const PREDEFINED_TIMERANGES = {
  allday: {
    id: "allday" as const,
    label: "All Day",
    start: HOURS[0].value,  // 0 (minutes past midnight for 00:00)
    end: HOURS[HOURS.length - 1].value,  // 1380 (minutes past midnight for 23:00)
    timeRangeLabel: "0-23h"
  },
  schoolHour: {
    id: "schoolHour" as const,
    label: "School Hour",
    start: HOURS[7].value,  // 420 (minutes past midnight for 07:00)
    end: HOURS[17].value,  // 1020 (minutes past midnight for 17:00)
    timeRangeLabel: "7-17h"
  },
  custom: {
    id: "custom" as const,
    label: "Custom"
  }
} as const;

export type PredefinedTimeRangeKey = keyof typeof PREDEFINED_TIMERANGES;
export type PredefinedTimeRange = typeof PREDEFINED_TIMERANGES[PredefinedTimeRangeKey];

// Type for ranges with start and end times (allday and schoolHour)
export type TimeRangeWithBounds = {
  id: string;
  label: string;
  start: number;
  end: number;
  timeRangeLabel: string;
};

// Type for custom range (no start/end)
export type CustomTimeRange = {
  id: string;
  label: string;
};