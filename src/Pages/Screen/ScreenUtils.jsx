
// ---------- Sensor status
export const SensorStatus = {
  active: "active",
  temporaryOffline: "temporaryOffline",
  offline: "offline"
};

const SensorStatusCriteria = [
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

export const calculateSensorStatus = (lastSeenInHours) => {
  for (let i = 0; i < SensorStatusCriteria.length; i++) {
    const category = SensorStatusCriteria[i];
    if (category.cutoffInHours.low <= lastSeenInHours && lastSeenInHours <= category.cutoffInHours.high) {
      return category.name;
    }
  }
}

export const returnSensorStatus = (currentDataForSensor) => {
  switch (currentDataForSensor.sensor_status) {
    case SensorStatus.active:
      return null;
    case SensorStatus.temporaryOffline:
      return `Last seen: ${currentDataForSensor.lastSeen}h ago`;
    case SensorStatus.offline:
      return "Sensor offline";
    default:
      return null;
  }
}

// ----- Misc
export const capitalizeFirstCharacter = (inputString) => {
  if (inputString) return inputString.charAt(0).toUpperCase() + inputString.slice(1);
  else return null;
};

export const removeLastDirectoryFromURL = (url) => {
  const urlComponents = url.split('/');
  // Remove the last component (directory)
  urlComponents.pop();
  // Reconstruct the URL with the last directory removed
  return urlComponents.join('/') + '/';
}