import { returnHoursFromMinutesPastMidnight } from '../../Utils';

export const HOURS = Array.from({ length: 24 }, (_, i) => {
  const minutesPastMidnight = i * 60;
  return {
    label: returnHoursFromMinutesPastMidnight(minutesPastMidnight),
    value: minutesPastMidnight
  };
});
