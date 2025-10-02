import sectionData from '../../section_data.json';
import { getTranslation } from '../../Utils/UtilFunctions';
import AggregationType from '../DateRangePicker/AggregationType';

export const SensorStatus = {
  active: "active",
  temporaryOffline: "temporaryOffline",
  offline: "offline",
  unknown: "unknown"
};

const SensorStatusCriteria = (aggregationType = null) => {
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

export const calculateSensorStatus = (lastSeenInMinutes, aggregationType) => {
  const match = SensorStatusCriteria(aggregationType).find(({ cutoffInMinutes: { low, high } }) =>
    lastSeenInMinutes >= low && lastSeenInMinutes <= high
  );

  return match?.name ?? SensorStatus.unknown;
};


export const getFormattedLastSeen = (lastSeenInMinutes, language = 'en') => {
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

export const returnSensorStatusString = (sensorData, language = "en") => {
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

