import { calculateSensorStatus } from "../Components/AirQuality/SensorStatus";

// Types for fetchDataFromURL parameters
type FileExtension = 'json' | 'csv';
type RESTMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

interface FetchDataFromURLParams {
  url: string;
  extension?: FileExtension;
  needsAuthorization?: boolean;
  RESTmethod?: RESTMethod;
  body?: Record<string, unknown> | null;
  includesContentTypeHeader?: boolean;
  timeoutMs?: number;
}

interface FetchOptions {
  method: RESTMethod;
  credentials: RequestCredentials;
  body?: string;
  headers: Record<string, string>;
  signal: AbortSignal;
}

// Import OpenAPI types for proper typing
import type { components } from "../types/backend-api.types";
import type { SensorStatusType } from "../Components/AirQuality/SensorStatus";

// Backend returns this structure
type ProcessedSensorData = components["schemas"]["ProcessedSensorData"];

// After processing, we add these fields
type ProcessedSensorDataWithStatus = {
  sensor: ProcessedSensorData["sensor"] & {
    lastSeenInMinutes: number | null;
    sensor_status: SensorStatusType;
  };
  current: ProcessedSensorData["current"];
};

type SensorsDataResponse = ProcessedSensorDataWithStatus[];

interface FetchAndProcessParams {
  url: string;
}

export const fetchDataFromURL = async ({
  url,
  extension = "json",
  needsAuthorization = true,
  RESTmethod = "GET",
  body = null,
  includesContentTypeHeader = true,
  timeoutMs = 30000 // default: 30 seconds
}: FetchDataFromURLParams): Promise<unknown> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    if (!navigator.onLine) {
      throw new Error('You appear to be offline. Please check your internet connection.');
    }

    const fetchOptions: FetchOptions = {
      method: RESTmethod,
      credentials: needsAuthorization ? 'include' : 'omit',
      ...(body && { body: JSON.stringify(body) }),
      headers: {},
      signal: controller.signal
    };

    if (includesContentTypeHeader) {
      switch (extension) {
        case "json":
          fetchOptions.headers["Content-Type"] = "application/json; charset=UTF-8";
          break;
        case "csv":
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
      case "json":
        return await response.json();
      case "csv":
        return await response.text();
      default:
        return response;
    }
  } catch (error) {
    clearTimeout(timeoutId);

    if (error instanceof Error && (error.name === 'AbortError' || error.message === 'Failed to fetch')) {
      window.dispatchEvent(new Event('server:down'));
    }

    throw error;
  }
};

export const fetchAndProcessCurrentSensorsData = async ({ url }: FetchAndProcessParams): Promise<SensorsDataResponse | undefined> => {
  try {
    const data = await fetchDataFromURL({ url }) as ProcessedSensorData[];

    if (!data) {
      throw new Error('Returned data is empty');
    }

    if (!Array.isArray(data)) {
      throw new Error('Expected array response from API');
    }

    try {
      // Process each sensor data item
      const processedData: SensorsDataResponse = data.map(sensorData => {
        // Calculate if the sensor is currently active or not
        const now = new Date();
        const lastSeen = sensorData.sensor?.last_seen || sensorData.current?.timestamp;
        const lastSeenTimestamp = new Date(lastSeen as string);
        const lastSeenInMinutes = Math.round((now.getTime() - lastSeenTimestamp.getTime()) / 1000 / 60);

        // Return processed sensor data with additional fields
        return {
          ...sensorData,
          sensor: {
            ...sensorData.sensor,
            lastSeenInMinutes: lastSeenInMinutes > 10 * 365 * 24 * 60 ? null : lastSeenInMinutes, // if more than 10 years (likely UNIX time = 0), then return null
            sensor_status: calculateSensorStatus(lastSeenInMinutes)
          }
        };
      });

      return processedData;

    } catch (error) {
      // Handle the case where data is not processable
      console.error("Error processing sensor data", error);
      throw error;
    }
  }
  catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Error fetching data: ${message}`);
  }
};
