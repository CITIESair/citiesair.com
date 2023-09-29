import { useState, useEffect, useCallback, createContext, useMemo } from 'react';
import { gapi } from 'gapi-script';

export const SheetsDataContext = createContext();

export function SheetsDataProvider(props) {
  const { children } = props;

  const [sheetData, setSheetData] = useState({});
  const value = useMemo(() => [sheetData], [sheetData]);

  const getSheetNameFromRange = useCallback((range) => range.split('!')[0], []); // Range format: [sheetName]![A2:A2]

  const getLastUpdateData = useCallback(async () => {
    const sheetDataMap = {};
    try {
      const spreadsheetId = '1ddbsEukjKPX3tApu2nYRDoQpLMGpqFdrZ9jh_JYh5Tk';
      const response = await gapi.client.sheets.spreadsheets.get({ spreadsheetId });

      const ranges = response.result.sheets.map((sheet) => `${sheet.properties.title}!A2:A2`);
      const dataResponse = await gapi.client.sheets.spreadsheets.values.batchGet({
        spreadsheetId,
        ranges,
      });

      dataResponse.result.valueRanges.forEach((range, index) => {
        if (range.values && range.values.length > 0) {
          const sheetName = getSheetNameFromRange(ranges[index]);
          const [[firstValue]] = range.values;
          sheetDataMap[sheetName] = firstValue;
        }
      });
      return sheetDataMap;
    } catch (err) {
      console.error(err);
      return sheetDataMap;
    }
  }, [getSheetNameFromRange]);

  useEffect(() => {
    gapi.load('client:auth2', () => {
      gapi.client.init({
        apiKey: 'AIzaSyCjVRS9swFZFN8FQq9ChM0FHWb_kRc0LCI',
        discoveryDocs: [
          'https://sheets.googleapis.com/$discovery/rest?version=v4',
        ],
      }).then(() => {
        getLastUpdateData().then((data) => {
          setSheetData(data);
        });
      }).catch((err) => {
        console.error(err);
      });
    });
  }, [getLastUpdateData]);

  return (
    <SheetsDataContext.Provider value={value}>
      {children}
    </SheetsDataContext.Provider>
  );
}
