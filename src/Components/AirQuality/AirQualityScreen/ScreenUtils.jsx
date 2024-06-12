import { SensorStatus, SensorStatusCriteria } from "../SensorStatus"

// ---------- Calculate time difference and return appropriate format
export const getFormattedElapsedTimeFromNow = (dateString) => {
  const inputDate = new Date(dateString);
  const currentDate = new Date();
  const timeDifference = currentDate - inputDate;

  // Calculate time differences in seconds, minutes, hours, and days
  const seconds = Math.floor(timeDifference / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  // Determine the most prominent time unit
  if (days > 0) {
    return `${days}d`;
  } else if (hours > 0) {
    return `${hours}h`;
  } else if (minutes > 0) {
    return `${minutes}m`;
  } else {
    return `${seconds}s`;
  }
}

export const calculateSensorStatus = (lastSeenInHours) => {
  for (let i = 0; i < SensorStatusCriteria.length; i++) {
    const category = SensorStatusCriteria[i];
    if (category.cutoffInHours.low <= lastSeenInHours && lastSeenInHours <= category.cutoffInHours.high) {
      return category.name;
    }
  }
}

export const returnSensorStatus = (sensorData) => {
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
}

// ----- Misc
export const capitalizeFirstCharacter = (inputString) => {
  if (inputString) return inputString.charAt(0).toUpperCase() + inputString.slice(1);
  else return null;
};

export const getDomainName = (url) => {
  return new URL(url).hostname;
}

export const getUrlAfterScreen = (url) => {
  const screenString = 'screen';
  const urlComponents = url.split(screenString);
  return `${screenString}${urlComponents.pop()}`;
}

export const removeLastDirectoryFromURL = (url) => {
  const urlComponents = url.split('/');
  // Remove the last component (directory)
  urlComponents.pop();
  // Reconstruct the URL with the last directory removed
  return urlComponents.join('/') + '/';
}

export const areDOMOverlapped = (rect1, rect2) => {
  if (!(rect1.bottom < rect2.top || rect1.top > rect2.bottom)) {
    if (rect1.top < rect2.top) return -1;
    else return 1;
  }
  else return 0;
}
