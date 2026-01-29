import sectionData from '../../section_data.json';
import { getTranslation } from '../../Utils/UtilFunctions';
import AggregationType from '../DateRangePicker/AggregationType';

export const SensorStatus = {
  active: "active",
  temporaryOffline: "temporaryOffline",
  offline: "offline",
  unknown: "unknown"
} as const;

export type SensorStatusType = typeof SensorStatus[keyof typeof SensorStatus];

interface CutoffRange {
  low: number;
  high: number;
}

interface SensorStatusCriteriaItem {
  name: SensorStatusType;
  cutoffInMinutes: CutoffRange;
}

const SensorStatusCriteria = (aggregationType: string = AggregationType.minute): SensorStatusCriteriaItem[] => {
  const isHourly = aggregationType === AggregationType.hour;

  const activeHigh = isHourly ? 6 * 60 : 2 * 60; // in minutes
  const tempHigh = isHourly ? 24 * 60 : 6 * 60;

  return [
    {
      name: SensorStatus.active,
      cutoffInMinutes: {
        low: 0,
        high: activeHigh
      }
    },
    {
      name: SensorStatus.temporaryOffline,
      cutoffInMinutes: {
        low: activeHigh + 1,
        high: tempHigh
      }
    },
    {
      name: SensorStatus.offline,
      cutoffInMinutes: {
        low: tempHigh + 1,
        high: Infinity
      }
    }
  ];
};

export const calculateSensorStatus = (
  lastSeenInMinutes: number,
  aggregationType: string = AggregationType.minute
): SensorStatusType => {
  const match = SensorStatusCriteria(aggregationType).find(({ cutoffInMinutes: { low, high } }) =>
    lastSeenInMinutes >= low && lastSeenInMinutes <= high
  );

  return match?.name ?? SensorStatus.unknown;
};

export const getFormattedLastSeen = (lastSeenInMinutes: number | null, language: string = 'en'): string => {
  const agoText = getTranslation(sectionData.status.content.ago, language);
  if (lastSeenInMinutes === null || isNaN(lastSeenInMinutes) || typeof lastSeenInMinutes !== "number") {
    return "--";
  }
  else if (lastSeenInMinutes >= 0 && lastSeenInMinutes < 60) {
    return `${lastSeenInMinutes}m ${agoText}`;
  }
  else if (lastSeenInMinutes >= 60 && lastSeenInMinutes < 1440) {
    return `${Math.floor(lastSeenInMinutes / 60)}h ${agoText}`;
  }
  else {
    return `${Math.floor(lastSeenInMinutes / 1440)}d ${agoText}`;
  }
};

interface SensorData {
  sensor_status?: SensorStatusType;
  lastSeen?: number;
}

export const returnSensorStatusString = (sensorData: SensorData | null | undefined, language: string = "en"): string | null => {
  switch (sensorData?.sensor_status) {
    case SensorStatus.active:
      return null;
    case SensorStatus.temporaryOffline:
      return `${getTranslation(sectionData.status.content.lastUpdate, language)}: ${sensorData?.lastSeen}h ${getTranslation(sectionData.status.content.ago, language)}`;
    case SensorStatus.offline:
      return getTranslation(sectionData.status.content.offline, language);
    default:
      return null;
  }
};
