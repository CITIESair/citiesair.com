import AggregationType from "../Components/DateRangePicker/AggregationType";
import { API_CITIESair_URL } from "../Utils/GlobalVariables";
import { GeneralAPIendpoints } from "./Utils";

export const getAlertsApiUrl = ({ endpoint, school_id, alert_id }) => {
  if (endpoint !== GeneralAPIendpoints.alerts) return;

  // Build the base URL and optionally append the alert_id if provided
  const baseUrl = `${API_CITIESair_URL}/${endpoint}/${school_id}`;
  return alert_id ? `${baseUrl}/${alert_id}` : baseUrl;
};


export const getApiUrl = ({
  endpoint,
  school_id
}) => {

  switch (endpoint) {
    case GeneralAPIendpoints.current:
    case GeneralAPIendpoints.schoolmetadata:
    case GeneralAPIendpoints.chartdata:
    case GeneralAPIendpoints.alertsEmails:
      return `${API_CITIESair_URL}/${endpoint}/${school_id}`;

    case GeneralAPIendpoints.screen:
      const currentUrl = window.location.href;
      const regex = /\/screen\/(.+)/;
      const match = currentUrl.match(regex);
      if (match && match.length > 1) return `${API_CITIESair_URL}/${endpoint}/${match[1]}`
      else return;

    default:
      return `${API_CITIESair_URL}/${endpoint}`;
  }
}

export const getHistoricalChartApiUrl = ({ endpoint, school_id, aggregationType = AggregationType.hour, startDate, endDate, dataType }) => {
  const params = new URLSearchParams();

  if (dataType) params.append('dataType', dataType);
  if (aggregationType) params.append('aggregationType', aggregationType);
  if (startDate) params.append('startDate', startDate);
  if (endDate) params.append('endDate', endDate);

  return `${API_CITIESair_URL}/${endpoint}/${school_id}${params.toString() ? '?' + params : ''}`;
};


export const getChartApiUrl = ({ endpoint, school_id, dataType }) => {
  const params = new URLSearchParams();
  if (dataType) params.append('dataType', dataType);

  return `${API_CITIESair_URL}/${endpoint}/${school_id}${params.toString() ? '?' + params : ''}`;
};


export const getCorrelationChartApiUrl = ({ endpoint, school_id, dataType, sensorX, sensorY }) => {
  const params = new URLSearchParams();
  if (dataType) params.append('dataType', dataType);
  if (sensorX) params.append('sensorX', sensorX);
  if (sensorY) params.append('sensorY', sensorY);

  return `${API_CITIESair_URL}/${endpoint}/${school_id}${params.toString() ? '?' + params : ''}`;
};


export const getRawDatasetUrl = ({ school_id, sensor_location_short, aggregationType, isSample = true }) => {
  return `${API_CITIESair_URL}/${GeneralAPIendpoints.raw}/${school_id}/${sensor_location_short}/${aggregationType}?isSample=${isSample}`;
}
