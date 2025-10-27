import { GeneralAPIendpoints } from "./Utils";

const REACT_APP_BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export const getAlertsApiUrl = ({ endpoint, school_id, alert_id }) => {
  if (endpoint !== GeneralAPIendpoints.alerts) return;

  // Build the base URL and optionally append the alert_id if provided
  const baseUrl = `${REACT_APP_BACKEND_URL}/${endpoint}/${school_id}`;
  return alert_id ? `${baseUrl}/${alert_id}` : baseUrl;
};


export const getApiUrl = (props) => {
  const { endpoint, school_id, screen_id, queryParams } = props;

  const params = new URLSearchParams(
    Object.entries(queryParams ?? {}).filter(([_, v]) => v != null && v !== '')
  );

  const path = [REACT_APP_BACKEND_URL, endpoint, school_id, screen_id]
    .filter(Boolean) // removes undefined or null values
    .join('/');

  return `${path}${params.toString() ? `?${params}` : ''}`;
}

export const getRawDatasetUrl = ({ school_id, sensor_location_short, aggregationType, isSample = true }) => {
  return `${REACT_APP_BACKEND_URL}/${GeneralAPIendpoints.raw}/${school_id}/${sensor_location_short}/${aggregationType}?isSample=${isSample}`;
}
