// disable eslint for this file
/* eslint-disable */
import { useState, useEffect } from 'react';
import FullWidthBox from '../../Components/FullWidthBox';
import AQImap, { LocationTitle, TileOptions } from '../../Components/AirQuality/AQImap';
import { getApiUrl } from '../../API/ApiUrls';
import { GeneralAPIendpoints } from "../../API/Utils";
import { fetchAndProcessCurrentSensorsData } from '../../API/ApiFetch';
import { NYUAD } from '../../Utils/GlobalVariables';

const NYUADmap = () => {
  const [nyuadCurrentData, setNYUADcurrentData] = useState();

  const url = getApiUrl({
    endpoint: GeneralAPIendpoints.current,
    school_id: NYUAD
  });

  useEffect(() => {
    fetchAndProcessCurrentSensorsData(url)
      .then((data) => setNYUADcurrentData(data))
      .catch((error) => console.log(error))
  }, []);

  return (
    <FullWidthBox height="100vh" backgroundColor='customAlternateBackground'>
      <AQImap
        tileOption={TileOptions.nyuad}
        centerCoordinates={[24.5238, 54.43449]}
        maxBounds={[
          [24.52038, 54.42612],
          [24.52808, 54.44079]
        ]}
        defaultZoom={16.25}
        minZoom={16.25}
        maxZoom={16.25}
        disableInteraction={true}
        displayMinimap={false}
        fullSizeMap={true}
        showAttribution={false}
        mapData={nyuadCurrentData}
        locationTitle={LocationTitle.short}
        markerSizeInRem={0.65}
        ariaLabel={"A map of all air quality sensors at NYU Abu Dhabi"}
      />
    </FullWidthBox>
  );
};

export default NYUADmap;
