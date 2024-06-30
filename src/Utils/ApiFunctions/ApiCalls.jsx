export const RESTmethods = {
  GET: "GET",
  POST: "POST",
  PUT: "PUT",
  DELETE: "DELETE"
}

export const Extensions = {
  json: 'json',
  csv: 'csv'
}

const isUnsupportedFormat = (url) => {
  return url.lastIndexOf('.') === -1;
}

export const fetchDataFromURL = async ({
  url,
  extension = Extensions.json,
  needsAuthorization = true,
  restMethod = RESTmethods.GET,
  body = null,
  includesHeadersJSON = true
}) => {
  try {
    if (isUnsupportedFormat(url)) {
      throw new Error('Unsupported format');
    }

    const fetchOptions = {
      method: restMethod,
      credentials: needsAuthorization ? 'include' : 'omit',
      ...(body && { body: JSON.stringify(body) }),
      ...(Extensions.json && includesHeadersJSON && {
        headers: {
          "Content-type": "application/json; charset=UTF-8"
        }
      })
    };

    const response = await fetch(url, fetchOptions);

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    if (response.status === 204) {
      return true;
    }

    switch (extension) {
      case Extensions.json:
        return await response.json();
      case Extensions.csv:
        return await response.text();
      default:
        return response;
    }
  } catch (error) {
    throw new Error(`Error fetching data: ${error.message}`);
  }
};
