import { GeneralAPIendpoints } from "./Utils";

const REACT_APP_BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export const getAlertsApiUrl = ({ endpoint, school_id, alert_id }) => {
  if (endpoint !== GeneralAPIendpoints.alerts) return;

  // Build the base URL and optionally append the alert_id if provided
  const baseUrl = `${REACT_APP_BACKEND_URL}/${endpoint}/${school_id}`;
  return alert_id ? `${baseUrl}/${alert_id}` : baseUrl;
};


export const getApiUrl = ({
  endpoint,
  school_id,
  screen_id,
  aggregationType
}) => {

  switch (endpoint) {
    case GeneralAPIendpoints.current:
    case GeneralAPIendpoints.schoolmetadata:
    case GeneralAPIendpoints.chartdata:
    case GeneralAPIendpoints.alertsEmails:
      return `${REACT_APP_BACKEND_URL}/${endpoint}/${school_id}`;

    case GeneralAPIendpoints.screen: {
      const path = [REACT_APP_BACKEND_URL, endpoint, school_id, screen_id]
        .filter(Boolean) // removes undefined or null values
        .join('/');

      const params = new URLSearchParams();
      if (aggregationType !== undefined && aggregationType !== null) {
        params.append('aggregationType', aggregationType);
      }

      return params.toString() ? `${path}?${params}` : path;
    }

    default:
      return `${REACT_APP_BACKEND_URL}/${endpoint}`;
  }
}

export const getChartApiUrl = (props) => {
  const { endpoint, school_id, queryParams } = props;

  const params = new URLSearchParams(
    Object.entries(queryParams ?? {}).filter(([_, v]) => v != null && v !== '')
  );

  return `${REACT_APP_BACKEND_URL}/${endpoint}/${school_id}${params.toString() ? `?${params}` : ''}`;
};

export const getRawDatasetUrl = ({ school_id, sensor_location_short, aggregationType, isSample = true }) => {
  return `${REACT_APP_BACKEND_URL}/${GeneralAPIendpoints.raw}/${school_id}/${sensor_location_short}/${aggregationType}?isSample=${isSample}`;
}
