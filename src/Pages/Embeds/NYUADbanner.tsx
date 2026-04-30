import CurrentAQIMapWithGrid from "../../Components/AirQuality/CurrentAQI/CurrentAQIMapWithGrid";
import useCurrentSensorsData from "../../hooks/useCurrentSensorsData";
import { NYUAD } from "../../Utils/GlobalVariables";

const NYUADbanner = () => {
  const { data: currentSensorsData } = useCurrentSensorsData({ schoolID: NYUAD });

  return (
    <CurrentAQIMapWithGrid
      currentSensorsData={currentSensorsData}
      schoolID={NYUAD}
      isOnBannerPage={true}
      minMapHeight={"250px"}
    />
  );
};

export default NYUADbanner;
