export const SensorStatus = {
  active: "active",
  temporaryOffline: "temporaryOffline",
  offline: "offline"
};

export const SensorStatusCriteria = [
  {
    name: SensorStatus.active,
    cutoffInHours: {
      low: 0,
      high: 2
    }
  },
  {
    name: SensorStatus.temporaryOffline,
    cutoffInHours: {
      low: 3,
      high: 6
    }
  },
  {
    name: SensorStatus.offline,
    cutoffInHours: {
      low: 7,
      high: Infinity
    }
  }
];
