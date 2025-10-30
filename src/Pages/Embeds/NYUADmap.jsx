import FullWidthBox from '../../Components/FullWidthBox';
import AQImap from '../../Components/AirQuality/AirQualityMap/AQImap';
import { LocationTitles, TileOptions } from '../../Components/AirQuality/AirQualityMap/AirQualityMapUtils';
import useCurrentSensorsData from '../../hooks/useCurrentSensorsData';
import { NYUAD } from '../../Utils/GlobalVariables';

const NYUADmap = () => {
  const { data: currentSensorsData } = useCurrentSensorsData(NYUAD);

  return (
    <FullWidthBox width="100%" height="100vh" backgroundColor='customAlternateBackground'>
      <AQImap
        tileOption={TileOptions.nyuad}
        shouldCluster={false}
        defaultZoom={16.25}
        minZoom={16.25}
        maxZoom={16.25}
        disableInteraction={true}
        displayMinimap={false}
        fullSizeMap={true}
        showAttribution={false}
        mapData={currentSensorsData}
        locationTitle={LocationTitles.short}
        markerSizeInRem={0.65}
        ariaLabel={"A map of all air quality sensors at NYU Abu Dhabi"}
      />
    </FullWidthBox>
  );
};

export default NYUADmap;
