// disable eslint for this file
/* eslint-disable */
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import FullWidthBox from '../../Components/FullWidthBox';
import * as Tracking from '../../Utils/Tracking';
import AQImap, { LocationTitle, TileOptions } from '../../Components/AirQuality/AQImap';
import { GeneralEndpoints, fetchAndProcessCurrentSensorsData, getApiUrl } from '../../Utils/ApiUtils';
import ThemePreferences from '../../Themes/ThemePreferences';

const NYUADmap = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const themePreference = queryParams.get('themePreference') || ThemePreferences.light;

  const [nyuadCurrentData, setNYUADcurrentData] = useState();

  const url = getApiUrl({
    endpoint: GeneralEndpoints.current,
    school_id: 'nyuad'
  });

  useEffect(() => {
    fetchAndProcessCurrentSensorsData(url)
      .then((data) => setNYUADcurrentData(data))
      .catch((error) => console.log(error))
  }, []);

  return (
    <FullWidthBox height="100vh">
      <AQImap
        tileOption={TileOptions.nyuad}
        themePreference={themePreference}
        placeholderText={"Map of CITIESair air quality sensors on NYUAD campus."}
        centerCoordinates={[24.5237, 54.43449]}
        maxBounds={[
          [24.52038, 54.42612],
          [24.52808, 54.44079]
        ]}
        defaultZoom={16}
        minZoom={16}
        maxZoom={16}
        disableInteraction={true}
        displayMinimap={false}
        fullSizeMap={true}
        showAttribution={false}
        rawMapData={nyuadCurrentData}
        locationTitle={LocationTitle.short}
        markerSizeInRem={0.7}
      />
    </FullWidthBox>
  );
};

export default NYUADmap;
