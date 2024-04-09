// disable eslint for this file
/* eslint-disable */

import { useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { fetchDataFromURL } from "../Components/DatasetDownload/DatasetFetcher";
import Project from "./Project";
import { EndPoints, fetchAndProcessCurrentSensorsData, getApiUrl } from "../Utils/ApiUtils";
import { LinkContext } from "../ContextProviders/LinkContext";
import { DashboardContext } from "../ContextProviders/DashboardContext";

import { UserContext } from "../ContextProviders/UserContext";
import { LocalStorage } from "../Utils/LocalStorage";
import { UniqueRoutes } from "../Utils/RoutesUtils";

const Dashboard = () => {
  const { school_id_param } = useParams();
  const navigate = useNavigate();

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
    chartData, setChartData } = useContext(DashboardContext);
  const { user } = useContext(UserContext);

  useEffect(() => {
    // NYUAD is public --> skip authentication and just fetch data
    if (school_id_param === "nyuad") {
      fetchDataForDashboard('nyuad');
      setCurrentSchoolID('nyuad');
      return;
    };

    if (user.checkedAuthentication === true && user.authenticated === false) {
      navigate('/login');
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
        if (!(!schoolMetadata && !current && !chartData)) fetchDataForDashboard(school_id);
      }

      // If there is school_id_param, check if school_id_param is in the allowedSchools
      if (allowedSchools.map((school) => school.school_id).includes(school_id_param)) {
        setCurrentSchoolID(school_id_param);
        fetchDataForDashboard(school_id_param);
        localStorage.setItem(LocalStorage.schoolID, school_id_param);
        return;
      }
    }
  }, [user, school_id_param]);

  const fetchDataForDashboard = async (school_id) => {
    try {
      setSchoolMetadata();
      setCurrent();
      setChartData({ ...chartData, charts: null });

      const response = await Promise.all([
        fetchDataFromURL({
          url: getApiUrl({
            endpoint: EndPoints.schoolmetadata,
            school_id: school_id
          }),
          extension: 'json',
          needsAuthorization: true
        }),
        fetchAndProcessCurrentSensorsData(getApiUrl({
          endpoint: EndPoints.current,
          school_id: school_id
        }))
      ])

      setSchoolMetadata(response[0]);
      setCurrent(response[1]);

    } catch (error) {
      console.log(error);
    }

    fetchDataFromURL({
      url: getApiUrl({
        endpoint: EndPoints.chartdata,
        school_id: school_id
      }),
      extension: 'json',
      needsAuthorization: true
    })
      .then(data => {
        setChartData(data);
      })
      .catch((error) => {
        console.log(error);
      })
  }

  return (
    <>
      <Project />
    </>
  )
};

export default Dashboard;