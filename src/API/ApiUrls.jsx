const REACT_APP_BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export const getApiUrl = ({
  paths = [],
  queryParams = {}
}) => {
  // Build the path segments safely, filtering null/undefined/empty
  const filteredPaths = paths.filter(
    (segment) => segment !== undefined && segment !== null && segment !== ''
  );

  // Join into a valid URL path
  const path = [REACT_APP_BACKEND_URL, ...filteredPaths].join('/');

  // Build the query string (filtering out null/empty values)
  const params = new URLSearchParams(
    Object.entries(queryParams).filter(([_, v]) => v != null && v !== '')
  );

  // Return the full URL
  return `${path}${params.toString() ? `?${params}` : ''}`;
};

