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
      low: 3 * 60,
      high: 6 * 60
    }
  },
  {
    name: SensorStatus.offline,
    cutoffInMinutes: {
      low: 7 * 60,
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

export const getFormattedLastSeen = (lastSeenInMinutes) => {
  if (lastSeenInMinutes === null || isNaN(lastSeenInMinutes) || typeof lastSeenInMinutes !== "number") {
    return "--";
  }
  else if (lastSeenInMinutes >= 0 && lastSeenInMinutes < 60) {
    return `${lastSeenInMinutes}m ago`;
  }
  else if (lastSeenInMinutes >= 60 && lastSeenInMinutes < 1440) {
    return `${Math.floor(lastSeenInMinutes / 60)}h ago`;
  }
  else {
    return `${Math.floor(lastSeenInMinutes / 1440)}d ago`;
  }
};

export const returnSensorStatusString = (sensorData) => {
  switch (sensorData?.sensor_status) {
    case SensorStatus.active:
      return null;
    case SensorStatus.temporaryOffline:
      return `Last seen: ${sensorData?.lastSeen}h ago`;
    case SensorStatus.offline:
      return "Sensor offline";
    default:
      return null;
  }
};

