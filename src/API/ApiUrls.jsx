import AggregationType from "../Components/DateRangePicker/AggregationType";
import { API_CITIESair_URL } from "../Utils/GlobalVariables";
import { GeneralAPIendpoints } from "./Utils";

export const getAlertsApiUrl = ({
  endpoint,
  school_id,
  alert_id
}) => {
  if (endpoint !== GeneralAPIendpoints.alerts) return;

  return `${API_CITIESair_URL}/${endpoint}/${school_id}${alert_id ? `/${alert_id}` : ''}`;
}

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

export const getHistoricalChartApiUrl = ({ endpoint, school_id, aggregationType = AggregationType.hourly, startDate, endDate, dataType }) => {
  let baseUrl = `${API_CITIESair_URL}/${endpoint}/${school_id}?dataType=${dataType}&aggregationType=${aggregationType}`;

  if (startDate && endDate) {
    baseUrl = `${baseUrl}&startDate=${startDate}&endDate=${endDate}`;
  }

  return baseUrl;
};

export const getChartApiUrl = ({ endpoint, school_id, dataType }) => {
  return `${API_CITIESair_URL}/${endpoint}/${school_id}?dataType=${dataType}`;
}

export const getCorrelationChartApiUrl = ({ endpoint, school_id, dataType, sensorX, sensorY }) => {
  return `${API_CITIESair_URL}/${endpoint}/${school_id}?dataType=${dataType}&sensorX=${sensorX}&sensorY=${sensorY}`;
}

export const getRawDatasetUrl = ({ school_id, sensor_location_short, datasetType, isSample }) => {
  return `${API_CITIESair_URL}/${GeneralAPIendpoints.raw}/${school_id}/${sensor_location_short}/${datasetType}?isSample=${isSample === true ? true : false}`;
}
