import { returnHoursFromMinutesPastMidnight } from '../Utils';

export const HOURS = Array.from({ length: 23 }, (_, i) => {
  const minutesPastMidnight = (i + 1) * 60;
  return {
    label: returnHoursFromMinutesPastMidnight(minutesPastMidnight),
    value: minutesPastMidnight
  };
});
