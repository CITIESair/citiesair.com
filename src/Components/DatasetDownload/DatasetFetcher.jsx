// disable eslint for this file
/* eslint-disable */
export const fetchDataFromURL = async ({ url, extension, needsAuthorization }) => {
  try {
    const fetchParams = process.env.REACT_APP_ENV === 'local-backend' ? {} : {
      credentials: needsAuthorization && 'include'
    }

    const response = await fetch(url, fetchParams);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    switch (extension) {
      case 'json':
        const jsonData = await response.json();
        return jsonData;
      case 'csv':
        const csvData = await response.text();
        return csvData;
      default:
        return response;
    }
  } catch (error) {
    throw new Error(`Error fetching data: ${error.message}`);
  }
};
