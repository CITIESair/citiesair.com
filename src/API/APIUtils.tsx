const VITE_APP_BACKEND_URL = import.meta.env.VITE_APP_BACKEND_URL;

export type GeneralAPIEndpoint =
  | 'me'
  | 'current'
  | 'raw'
  | 'school_metadata'
  | 'chartdata'
  | 'screen'
  | 'allSensorsScreen'
  | 'login'
  | 'signup'
  | 'verify'
  | 'google/callback'
  | 'logout'
  | 'map_public_outdoors_stations'
  | 'alerts'
  | 'alerts/emails'
  | 'stats'
  | 'datatypes'
  | 'unsubscribe_alert';

export type ChartAPIEndpoint =
  | 'chart/historical'
  | 'chart/dailyAverageAllTime'
  | 'chart/percentageByMonth'
  | 'chart/yearlyAverageByDoW'
  | 'chart/hourlyAverageByMonth'
  | 'chart/correlationDailyAverage';

export const ChartAPIEndpointsOrder: ChartAPIEndpoint[] = [
  'chart/historical',
  'chart/dailyAverageAllTime',
  'chart/percentageByMonth',
  'chart/yearlyAverageByDoW',
  'chart/hourlyAverageByMonth',
  'chart/correlationDailyAverage',
];

type GetApiUrlArgs = {
  endpoint: GeneralAPIEndpoint | ChartAPIEndpoint
  paths?: Array<string | number | null | undefined>
  queryParams?: Record<string, string | number | boolean | null | undefined>
}

export const getApiUrl = ({
  endpoint,
  paths = [],
  queryParams = {},
}: GetApiUrlArgs): string => {
  // Filter invalid path segments
  const filteredPaths = paths.filter(
    (segment): segment is string | number =>
      segment !== undefined && segment !== null && segment !== ''
  );

  // Build base + endpoint + paths
  const path = [VITE_APP_BACKEND_URL, endpoint, ...filteredPaths]
    .map(String)
    .join('/');

  // Build query string
  const params = new URLSearchParams(
    Object.entries(queryParams)
      .filter(([, v]) => v !== undefined && v !== null && v !== '')
      .map(([k, v]) => [k, String(v)])
  );

  return params.toString() ? `${path}?${params}` : path;
};

