/* eslint-disable */

import { useState, createContext, useMemo, useEffect, useContext } from 'react';
import { fetchDataFromURL, fetchAndProcessCurrentSensorsData } from '../API/ApiFetch';
import { getApiUrl, getChartApiUrl } from '../API/ApiUrls';
import { ChartAPIendpointsOrder, GeneralAPIendpoints } from '../API/Utils';
import { AppRoutes } from '../Utils/AppRoutes';
import { KAMPALA, NUMBER_OF_CHARTS_TO_LOAD_INITIALLY, NYUAD } from '../Utils/GlobalVariables';
import { LocalStorage } from '../Utils/LocalStorage';
import { SnackbarMetadata } from '../Utils/SnackbarMetadata';
import { isValidArray } from '../Utils/UtilFunctions';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { UserContext } from './UserContext';
import { enqueueSnackbar } from 'notistack';
import AggregationType from '../Components/DateRangePicker/AggregationType';

export const DashboardContext = createContext("");

export function DashboardProvider({ children }) {
  const navigate = useNavigate();

  const { school_id_param } = useParams();
  const { user, authenticationState } = useContext(UserContext);

  const location = useLocation();
  const locationPath = location.pathname;
  const isDashboardPage = locationPath.includes(AppRoutes.dashboard);
  const isHomePage = locationPath === AppRoutes.home;

  const [schoolMetadata, setSchoolMetadata] = useState();
  const [currentSensorMeasurements, setCurrentSensorMeasurements] = useState();
  const [allChartsData, setAllChartsData] = useState({});
  const [currentSchoolID, setCurrentSchoolID] = useState();
  const [loadMoreCharts, setLoadMoreCharts] = useState(false);

  const [publicMapData, setPublicMapData] = useState();

  const setIndividualChartData = (chartID, chartData) => {
    setAllChartsData(prevData => ({
      ...prevData,
      [chartID]: chartData
    }));
  };

  const providerValue = useMemo(() => ({
    currentSchoolID, setCurrentSchoolID,
    schoolMetadata, setSchoolMetadata,
    currentSensorMeasurements, setCurrentSensorMeasurements,
    allChartsData, setIndividualChartData,
    loadMoreCharts, setLoadMoreCharts,
    publicMapData
  }), [currentSchoolID, schoolMetadata, currentSensorMeasurements, allChartsData, loadMoreCharts, publicMapData]);

  useEffect(() => {
    if (isHomePage && !publicMapData) {
      const mapUrl = getApiUrl({ endpoint: GeneralAPIendpoints.map });
      fetchAndProcessCurrentSensorsData(mapUrl)
        .then((data) => {
          setPublicMapData(data)
        })
        .catch((error) => console.log(error));
    }
  }, [isHomePage]);

  useEffect(() => {
    if (!authenticationState.checkedAuthentication) return;

    // If the user isn't logged in (after checking authentication status)
    // Navigate to the login if in dashboard page (rather than NYUAD)
    // or just fetch NYUAD if in homepage
    if (authenticationState.authenticated === false) {
      if (school_id_param === NYUAD || isHomePage) {
        setCurrentSchoolID(NYUAD);
        fetchInitialDataForDashboard(NYUAD);
        return;
      }

      if (isDashboardPage) {
        navigate(`${AppRoutes.login}?${AppRoutes.redirectQuery}=${locationPath}`);
        return;
      }
    }

    // Only authenticated users below this line
    if (isValidArray(user.allowedSchools)) {
      // If no school_id_param is given
      if (!school_id_param) {
        let school_id;

        // If there has been a previouslySelectedSchoolID, then load dashboard data for this one
        const previouslySelectedSchoolID = localStorage.getItem(LocalStorage.schoolID);

        if (user.allowedSchools.map((school) => school.school_id).includes(previouslySelectedSchoolID)) {
          school_id = previouslySelectedSchoolID;
          setCurrentSchoolID(school_id);
        }
        // If not existed yet, then just get the first school in the list
        else {
          school_id = user.allowedSchools[0].school_id;
          setCurrentSchoolID(school_id);
          localStorage.setItem(LocalStorage.schoolID, school_id);
        }

        if (isDashboardPage) {
          navigate(school_id, { replace: true }); // navigate to the correct url: /dashboard/:school_id_param
        }

        // If there is no schoolMetadata or current or chartData, then fetch them
        if (!(!schoolMetadata && !currentSensorMeasurements && !allChartsData)) fetchInitialDataForDashboard(school_id);
      }
      // If there is school_id_param, check if school_id_param is in the allowedSchools
      else {
        if (user.allowedSchools.map((school) => school.school_id).includes(school_id_param)) {
          setCurrentSchoolID(school_id_param);
          fetchInitialDataForDashboard(school_id_param);
          localStorage.setItem(LocalStorage.schoolID, school_id_param);
        }
        // If the school_id_param is not in the allowedSchools
        else {
          // NYUAD case
          if (school_id_param === NYUAD) {
            setCurrentSchoolID(NYUAD);
            fetchInitialDataForDashboard(NYUAD);
          } else {
            enqueueSnackbar("You don't have permission to view this school or this school does not exist.", SnackbarMetadata.error);
            navigate(AppRoutes[404], { replace: true });
          }
        }
      }
    } else {
      setCurrentSchoolID(NYUAD);
      fetchInitialDataForDashboard(NYUAD);
      if (isDashboardPage) {
        navigate(AppRoutes.nyuad); // else, if there is no valid allowedSchools for this user, route to public NYUAD dashboard
      }
    }
  }, [user, authenticationState, school_id_param, isDashboardPage]);

  const fetchInitialDataForDashboard = async (school_id) => {
    try {
      setSchoolMetadata();
      setCurrentSensorMeasurements();

      const response = await Promise.all([
        fetchDataFromURL({
          url: getApiUrl({
            endpoint: GeneralAPIendpoints.schoolmetadata,
            school_id: school_id
          })
        }),
        fetchAndProcessCurrentSensorsData(
          getApiUrl({
            endpoint: GeneralAPIendpoints.current,
            school_id: school_id
          }),
          school_id === KAMPALA ? AggregationType.hour : null
        )
      ])

      setSchoolMetadata(response[0]);
      setCurrentSensorMeasurements(response[1]);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (loadMoreCharts === true) {
      const restOfCharts = ChartAPIendpointsOrder.slice(NUMBER_OF_CHARTS_TO_LOAD_INITIALLY);
      restOfCharts.forEach((endpoint, index) => {
        const chartIndexInPage = NUMBER_OF_CHARTS_TO_LOAD_INITIALLY + index;
        setIndividualChartData(chartIndexInPage, {}); // set empty chartData to create a placeholder for this chart

        fetchDataFromURL({
          url: getChartApiUrl({
            endpoint: endpoint,
            school_id: currentSchoolID
          })
        })
          .then(data => {
            setIndividualChartData(chartIndexInPage, data);
          })
          .catch((error) => {
            console.log(error);
          })
      });
    }

  }, [loadMoreCharts]);

  return (
    <DashboardContext.Provider value={providerValue}>
      {children}
    </DashboardContext.Provider>
  );
}
