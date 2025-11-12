import { calculateSensorStatus } from "../Components/AirQuality/SensorStatus";
import { SupportedFetchExtensions, RESTmethods } from "./Utils";

export const fetchDataFromURL = async ({
  url,
  extension = SupportedFetchExtensions.json,
  needsAuthorization = true,
  restMethod = RESTmethods.GET,
  body = null,
  includesContentTypeHeader = true,
  timeoutMs = 30000 // default: 30 seconds
}) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    if (!navigator.onLine) {
      throw new Error('You appear to be offline. Please check your internet connection.');
    }

    const fetchOptions = {
      method: restMethod,
      credentials: needsAuthorization ? 'include' : 'omit',
      ...(body && { body: JSON.stringify(body) }),
      headers: {},
      signal: controller.signal
    };

    if (includesContentTypeHeader) {
      switch (extension) {
        case SupportedFetchExtensions.json:
          fetchOptions.headers["Content-Type"] = "application/json; charset=UTF-8";
          break;
        case SupportedFetchExtensions.csv:
          fetchOptions.headers["Content-Type"] = "text/csv; charset=UTF-8";
          break;
        default:
          break;
      }
    }

    const response = await fetch(url, fetchOptions);
    clearTimeout(timeoutId);

    if (response.status >= 500 && response.status < 600) {
      window.dispatchEvent(new Event('server:down'));
      throw new Error("Internal Server Error");
    }

    if (response.status === 204) {
      return true;
    }

    if (!response.ok) {
      const contentType = response.headers.get('Content-Type');
      if (contentType && contentType.includes('application/json')) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Network response not OK');
      } else {
        const errorText = await response.text();
        throw new Error(errorText || 'Network response not OK');
      }
    }

    // Response OK
    window.dispatchEvent(new Event('server:up'));

    switch (extension) {
      case SupportedFetchExtensions.json:
        return await response.json();
      case SupportedFetchExtensions.csv:
        return await response.text();
      default:
        return response;
    }
  } catch (error) {
    clearTimeout(timeoutId);

    if (error.name === 'AbortError' || error.message === 'Failed to fetch') {
      window.dispatchEvent(new Event('server:down'));
    }

    throw error;
  }
};

export const fetchAndProcessCurrentSensorsData = async ({ url }) => {
  try {
    const data = await fetchDataFromURL({ url });

    if (!data) {
      throw new Error('Returned data is empty');
    }

    try {
      Object.entries(data).forEach(([_, sensorData]) => {
        // Calculate if the sensor is currently active or not
        const now = new Date();
        const lastSeen = sensorData.sensor?.last_seen || sensorData.current?.timestamp;
        const lastSeenTimestamp = new Date(lastSeen);
        const lastSeenInMinutes = Math.round((now - lastSeenTimestamp) / 1000 / 60);

        // Update sensor metadata
        sensorData.sensor = {
          ...sensorData.sensor,
          lastSeenInMinutes: lastSeenInMinutes > 10 * 365 * 24 * 60 ? null : lastSeenInMinutes, // if more than 10 years (likely UNIX time = 0), then return null
          sensor_status: calculateSensorStatus(lastSeenInMinutes)
        }
      });

      return data;

    } catch (error) {
      // Handle the case where data is not an iterable object
      console.error("Error: data is not iterable", error);
    }
  }
  catch (error) {
    throw new Error(`Error fetching data: ${error.message}`);
  }
};
