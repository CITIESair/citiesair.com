export const GeneralAPIendpoints = {
  me: "me",
  current: "current",
  raw: "raw",
  schoolmetadata: "schoolmetadata",
  chartdata: "chartdata",
  screen: "screen",
  login: "login",
  logout: "logout",
  map: "map_public_outdoors_stations",
  alerts: "alerts",
  alertsEmails: "alerts/emails"
};

export const ChartAPIendpoints = {
  historical: "chart/historicalAQI",
  dailyAverageAllTime: "chart/dailyAverageAllTime",
  percentageByMonth: "chart/percentageByMonth",
  yearlyAverageByDoW: "chart/yearlyAverageByDoW",
  hourlyAverageByMonth: "chart/hourlyAverageByMonth",
  correlationDailyAverage: "chart/correlationDailyAverage"
};

export const ChartAPIendpointsOrder = [
  ChartAPIendpoints.historical,
  ChartAPIendpoints.dailyAverageAllTime,
  ChartAPIendpoints.percentageByMonth,
  ChartAPIendpoints.yearlyAverageByDoW,
  ChartAPIendpoints.hourlyAverageByMonth,
  ChartAPIendpoints.correlationDailyAverage
];

export const RawDatasetType = {
  daily: "daily",
  hourly: "hourly"
};

export const RESTmethods = {
  GET: "GET",
  POST: "POST",
  PUT: "PUT",
  DELETE: "DELETE"
};

export const SupportedFetchExtensions = {
  json: 'json',
  csv: 'csv'
};

