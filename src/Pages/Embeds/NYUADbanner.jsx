import { useContext } from "react";
import CurrentAQIMapWithGrid from "../../Components/AirQuality/CurrentAQI/CurrentAQIMapWithGrid";
import { DashboardContext } from "../../ContextProviders/DashboardContext";


const NYUADbanner = () => {
  const { currentSensorMeasurements } = useContext(DashboardContext);

  return (
    <CurrentAQIMapWithGrid
      currentSensorsData={currentSensorMeasurements}
      isOnBannerPage={true}
      minMapHeight={"250px"}
    />
  );
};

export default NYUADbanner;
