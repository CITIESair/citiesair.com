import { useState, useEffect, createContext, useMemo } from 'react';
import { fetchDataFromURL } from '../Components/DatasetDownload/DatasetFetcher';

export const RawDatasetsMetadataContext = createContext();

const url = 'https://raw.githubusercontent.com/CITIES-Dashboard/datasets/main/datasets_metadata.json';

export function RawDatasetsMetadataProvider({ children }) {
  const [rawDatasetsMetadata, setRawDatasetsMetadata] = useState();

  useEffect(() => {
    if (!rawDatasetsMetadata) {
      try {
        fetchDataFromURL(url, 'json')
          .then((jsonData) => {
            setRawDatasetsMetadata(jsonData);
          });
      } catch (error) {
        console.log('Error fetching raw datasets metadata:', error);
      }
    }
  }, []);

  // eslint-disable-next-line max-len
  const providerValue = useMemo(() => rawDatasetsMetadata, [rawDatasetsMetadata]);

  // return context provider
  return (
    <RawDatasetsMetadataContext.Provider value={providerValue}>
      {children}
    </RawDatasetsMetadataContext.Provider>
  );
}
