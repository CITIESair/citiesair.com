// disable eslint for this file
/* eslint-disable */

import { useEffect, useContext } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import { fetchDataFromURL } from "../API/ApiFetch";
import Project from "./Project/Project";
import { getApiUrl, getChartApiUrl } from "../API/ApiUrls";
import { ChartAPIendpointsOrder, GeneralAPIendpoints } from "../API/Utils";
import { fetchAndProcessCurrentSensorsData } from "../API/ApiFetch";
import { MetadataContext } from "../ContextProviders/MetadataContext";
import { DashboardContext } from "../ContextProviders/DashboardContext";

import { UserContext } from "../ContextProviders/UserContext";
import { LocalStorage } from "../Utils/LocalStorage";
import { AppRoutes } from "../Utils/AppRoutes";
import { CITIESair, NUMBER_OF_CHARTS_TO_LOAD_INITIALLY, NYUAD } from "../Utils/GlobalVariables";
import { isValidArray } from "../Utils/UtilFunctions";

import { useSnackbar } from "notistack";
import { SnackbarMetadata } from "../Utils/SnackbarMetadata";

const Dashboard = () => {
  const { school_id_param } = useParams();
  const navigate = useNavigate();

  const location = useLocation();
  const locationPath = location.pathname;

  const { enqueueSnackbar } = useSnackbar()

  // Update the page's title based on school_id_param
  useEffect(() => {
    if (!school_id_param) return;

    document.title = `${CITIESair} | ${school_id_param.toUpperCase()}`;
  }, [school_id_param]);

  // Update current page type
  const { setCurrentPage } = useContext(MetadataContext);
  useEffect(() => {
    setCurrentPage(AppRoutes.dashboard);
  }, []);

  const {
    currentSchoolID, setCurrentSchoolID,
    schoolMetadata, setSchoolMetadata,
    current, setCurrent,
    allChartsData, setIndividualChartData,
    loadMoreCharts
  } = useContext(DashboardContext);
  const { user, authenticationState } = useContext(UserContext);

  useEffect(() => {
    // NYUAD is public --> skip authentication and just fetch data
    if (school_id_param === NYUAD) {
      fetchInitialDataForDashboard(NYUAD);
      setCurrentSchoolID(NYUAD);
      return;
    };

    if (authenticationState.checkedAuthentication === true && authenticationState.authenticated === false) {
      navigate(`${AppRoutes.login}?${AppRoutes.redirectQuery}=${locationPath}`);
      return;
    }

    const allowedSchools = user.allowedSchools;

    if (isValidArray(allowedSchools)) {
      // If no school_id_param is given
      if (!school_id_param) {
        let school_id;

        // If there has been a previouslySelectedSchoolID, then load dashboard data for this one
        const previouslySelectedSchoolID = localStorage.getItem(LocalStorage.schoolID);

        if (allowedSchools.map((school) => school.school_id).includes(previouslySelectedSchoolID)) {
          school_id = previouslySelectedSchoolID;
        }
        // If not existed yet, then just get the first school in the list
        else {
          school_id = allowedSchools[0].school_id;
          setCurrentSchoolID(school_id);
          localStorage.setItem(LocalStorage.schoolID, school_id);
        }

        navigate(school_id, { replace: true }); // navigate to the correct url: /dashboard/:school_id_param

        // If there is no schoolMetadata or current or chartData, then fetch them
        if (!(!schoolMetadata && !current && !allChartsData)) fetchInitialDataForDashboard(school_id);
      }
      // If there is school_id_param, check if school_id_param is in the allowedSchools
      else {
        if (allowedSchools.map((school) => school.school_id).includes(school_id_param)) {
          setCurrentSchoolID(school_id_param);
          fetchInitialDataForDashboard(school_id_param);
          localStorage.setItem(LocalStorage.schoolID, school_id_param);
        }
        // If the school_id_param is not in the allowedSchools
        else {
          enqueueSnackbar("You don't have permission to view this school or this school does not exist.", {
            variant: SnackbarMetadata.error.name,
            duration: SnackbarMetadata.error.duration
          });

          navigate(AppRoutes[404], { replace: true });
        }
      }
    } else {
      navigate(AppRoutes.nyuad); // else, if there is no valid allowedSchools for this user, route to public NYUAD dashboard
    }
  }, [user, school_id_param]);

  const fetchInitialDataForDashboard = async (school_id) => {
    try {
      setSchoolMetadata();
      setCurrent();

      const response = await Promise.all([
        fetchDataFromURL({
          url: getApiUrl({
            endpoint: GeneralAPIendpoints.schoolmetadata,
            school_id: school_id
          })
        }),
        fetchAndProcessCurrentSensorsData(getApiUrl({
          endpoint: GeneralAPIendpoints.current,
          school_id: school_id
        }))
      ])

      setSchoolMetadata(response[0]);
      setCurrent(response[1]);

    } catch (error) {
      console.log(error);
    }

    const chartsToFetch = loadMoreCharts ? ChartAPIendpointsOrder : ChartAPIendpointsOrder.slice(0, NUMBER_OF_CHARTS_TO_LOAD_INITIALLY);
    chartsToFetch.forEach((endpoint, index) => {
      setIndividualChartData(index, {}); // set empty chartData to create a placeholder for this chart

      fetchDataFromURL({
        url: getChartApiUrl({
          endpoint: endpoint,
          school_id: school_id
        })
      })
        .then(data => {
          setIndividualChartData(index, data);
        })
        .catch((error) => {
          console.log(error);
        })
    });
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
    <Project />
  )
};

export default Dashboard;