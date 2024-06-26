// disable eslint for this file
/* eslint-disable */

import { useEffect, useContext } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import { fetchDataFromURL } from "../Utils/ApiFunctions/ApiCalls";
import Project from "./Project";
import { ChartEndpointsOrder, GeneralEndpoints, fetchAndProcessCurrentSensorsData, getApiUrl, getChartApiUrl, getHistoricalChartApiUrl } from "../Utils/ApiFunctions/ApiUtils";
import { LinkContext } from "../ContextProviders/LinkContext";
import { DashboardContext } from "../ContextProviders/DashboardContext";

import { UserContext } from "../ContextProviders/UserContext";
import { LocalStorage } from "../Utils/LocalStorage";
import { UniqueRoutes } from "../Utils/RoutesUtils";

const numInitialCharts = 2;

const Dashboard = () => {
  const { school_id_param } = useParams();
  const navigate = useNavigate();

  const location = useLocation();
  const locationPath = location.pathname;

  // Update the page's title based on school_id_param
  useEffect(() => {
    if (!school_id_param) return;

    document.title = `CITIESair | ${school_id_param.toUpperCase()}`;
  }, [school_id_param]);

  // Update current page type
  const { setCurrentPage } = useContext(LinkContext);
  useEffect(() => {
    setCurrentPage(UniqueRoutes.dashboard);
  }, []);

  const {
    currentSchoolID, setCurrentSchoolID,
    schoolMetadata, setSchoolMetadata,
    current, setCurrent,
    allChartsData, setIndividualChartData,
    loadMoreCharts
  } = useContext(DashboardContext);
  const { user } = useContext(UserContext);

  useEffect(() => {
    // NYUAD is public --> skip authentication and just fetch data
    if (school_id_param === "nyuad") {
      fetchInitialDataForDashboard('nyuad');
      setCurrentSchoolID('nyuad');
      return;
    };

    if (user.checkedAuthentication === true && user.authenticated === false) {
      navigate(`${UniqueRoutes.login}?${UniqueRoutes.redirectQuery}=${locationPath}`);
    }

    const allowedSchools = user.allowedSchools;

    if (Array.isArray(allowedSchools) && allowedSchools.length > 0) {
      // If no school_id_param is given
      if (!school_id_param) {
        let school_id;

        // If there has been a previouslySelectedSchoolID, then load dashboard data for this one
        const previouslySelectedSchoolID = localStorage.getItem(LocalStorage.schoolID);
        if (allowedSchools.map((school) => school.school_id).includes(previouslySelectedSchoolID)) school_id = previouslySelectedSchoolID;
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
      if (allowedSchools.map((school) => school.school_id).includes(school_id_param)) {
        setCurrentSchoolID(school_id_param);
        fetchInitialDataForDashboard(school_id_param);
        localStorage.setItem(LocalStorage.schoolID, school_id_param);
        return;
      }
    }
  }, [user, school_id_param]);

  const fetchInitialDataForDashboard = async (school_id) => {
    try {
      setSchoolMetadata();
      setCurrent();

      const response = await Promise.all([
        fetchDataFromURL({
          url: getApiUrl({
            endpoint: GeneralEndpoints.schoolmetadata,
            school_id: school_id
          })
        }),
        fetchAndProcessCurrentSensorsData(getApiUrl({
          endpoint: GeneralEndpoints.current,
          school_id: school_id
        }))
      ])

      setSchoolMetadata(response[0]);
      setCurrent(response[1]);

    } catch (error) {
      console.log(error);
    }

    const chartsToFetch = loadMoreCharts ? ChartEndpointsOrder : ChartEndpointsOrder.slice(0, numInitialCharts);
    chartsToFetch.forEach((endpoint, index) => {
      setIndividualChartData(index, {}); // set empty chartData to create a placeholder for this chart

      fetchDataFromURL({
        url: getHistoricalChartApiUrl({
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
      const restOfCharts = ChartEndpointsOrder.slice(numInitialCharts);
      restOfCharts.forEach((endpoint, index) => {
        const chartIndexInPage = numInitialCharts + index;
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
    <>
      <Project />
    </>
  )
};

export default Dashboard;