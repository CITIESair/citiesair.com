import sectionData from '../../section_data.json';
import { getTranslation } from '../../Utils/UtilFunctions';

export const SensorStatus = {
  active: "active",
  temporaryOffline: "temporaryOffline",
  offline: "offline",
  unknown: "unknown"
};

export const SensorStatusCriteria = [
  {
    name: SensorStatus.active,
    cutoffInMinutes: {
      low: 0,
      high: 2 * 60 // 2 hours
    }
  },
  {
    name: SensorStatus.temporaryOffline,
    cutoffInMinutes: {
      low: 2 * 60 + 1,
      high: 6 * 60
    }
  },
  {
    name: SensorStatus.offline,
    cutoffInMinutes: {
      low: 6 * 60 + 1,
      high: Infinity
    }
  }
];

export const calculateSensorStatus = (lastSeenInMinutes) => {
  try {
    for (let i = 0; i < SensorStatusCriteria.length; i++) {
      const category = SensorStatusCriteria[i];
      if (category.cutoffInMinutes.low <= lastSeenInMinutes && lastSeenInMinutes <= category.cutoffInMinutes.high) {
        return category.name;
      }
    }
    return SensorStatus.unknown;

  } catch {
    return SensorStatus.unknown;
  }
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

