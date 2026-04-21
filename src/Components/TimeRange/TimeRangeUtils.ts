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
 * Interface for time range definitions
 * - id: Unique identifier for the range
 * - label: Display label for the range
 * - start: Optional start time in minutes past midnight (required for predefined ranges)
 * - end: Optional end time in minutes past midnight (required for predefined ranges)
 * - timeRangeLabel: Optional label showing the time range (e.g., "0-23h")
 */
export interface TimeRangeDefinition {
  id: string;
  label: string;
  start?: number;
  end?: number;
  timeRangeLabel?: string;
}

/**
 * Predefined time ranges for time selection
 * - allday: Full 24-hour range (0-23h, represented as 0-1380 minutes past midnight)
 * - schoolHour: School hours range (7-17h, represented as 420-1020 minutes past midnight)
 * - custom: User-defined custom range (no predefined start/end)
 */
export const PREDEFINED_TIMERANGES: Record<string, TimeRangeDefinition> = {
  allday: {
    id: "allday",
    label: "All Day",
    start: HOURS[0].value,  // 0 (minutes past midnight for 00:00)
    end: HOURS[HOURS.length - 1].value,  // 1380 (minutes past midnight for 23:00)
    timeRangeLabel: "0-23h"
  },
  schoolHour: {
    id: "schoolHour",
    label: "School Hour",
    start: HOURS[7].value,  // 420 (minutes past midnight for 07:00)
    end: HOURS[17].value,  // 1020 (minutes past midnight for 17:00)
    timeRangeLabel: "7-17h"
  },
  custom: {
    id: "custom",
    label: "Custom"
  }
};

export type PredefinedTimeRangeKey = keyof typeof PREDEFINED_TIMERANGES;