// disable eslint for this file
/* eslint-disable */

import { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { fetchDataFromURL } from "../../Components/DatasetDownload/DatasetFetcher";
import Project from "../Project/Project";
import { EndPoints, fetchAndProcessCurrentSensorsData, getApiUrl } from "../../Utils/ApiUtils";
import { LinkContext } from "../../ContextProviders/LinkContext";

import { UserContext } from "../../ContextProviders/UserContext";
import { LocalStorage } from "../../Utils/LocalStorage";
import { UniqueRoutes } from "../../Utils/RoutesUtils";

const Dashboard = ({ themePreference, temperatureUnitPreference }) => {
  const { school_id_param } = useParams();
  const navigate = useNavigate();

  // Update the page's title based on school_id_param
  useEffect(() => {
    if (!school_id_param) return;

    document.title = `CITIESair | ${school_id_param.toUpperCase()}`;
  }, [school_id_param]);

  const [_, setCurrentPage, __, ___] = useContext(LinkContext);
  useEffect(() => {
    setCurrentPage(UniqueRoutes.dashboard);
  }, []);

  const { user } = useContext(UserContext);

  const emptySchoolMetadata = {};
  const [schoolMetadata, setSchoolMetadata] = useState(emptySchoolMetadata);
  const emptyCurrentData = null;
  const [currentData, setCurrentData] = useState(emptyCurrentData);
  const emptyChartDataForDashboard = {};
  const [chartDataForDashboard, setChartDataForDashboard] = useState(emptyChartDataForDashboard);

  useEffect(() => {
    // NYUAD is public --> skip authentication and just fetch data
    if (school_id_param === "nyuad") {
      fetchDataForDashboard('nyuad');
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
          localStorage.setItem(LocalStorage.schoolID, school_id)
        }

        // If there is no schoolMetadata or currentData or chartData, then fetch them
        if (Object.keys(schoolMetadata).length === 0 ||
          !currentData ||
          Object.keys(chartDataForDashboard).length === 0
        ) {
          fetchDataForDashboard(school_id);
        }

        navigate(school_id, { replace: true }); // navigate to the correct url: /dashboard/:school_id_param
      }

      // If there is school_id_param, check if school_id_param is in the allowedSchools
      if (allowedSchools.map((school) => school.school_id).includes(school_id_param)) {
        fetchDataForDashboard(school_id_param);
        localStorage.setItem(LocalStorage.schoolID, school_id_param);
        return;
      }
    }
  }, [user, school_id_param]);

  const fetchDataForDashboard = async (school_id) => {
    const schoolMetadataUrl = getApiUrl({
      endpoint: EndPoints.schoolmetadata,
      school_id: school_id
    });

    setSchoolMetadata(emptySchoolMetadata);
    setCurrentData(emptyCurrentData);
    setChartDataForDashboard({ ...chartDataForDashboard, charts: null });

    const currentUrl = getApiUrl({
      endpoint: EndPoints.current,
      school_id: school_id
    });

    const chartDataUrl = getApiUrl({
      endpoint: EndPoints.chartdata,
      school_id: school_id
    });

    const dashboardData = await Promise.all([
      fetchDataFromURL({ url: schoolMetadataUrl, extension: 'json', needsAuthorization: true }),
      fetchAndProcessCurrentSensorsData(currentUrl)
    ])

    const schoolMetadata = dashboardData[0];
    const currentData = dashboardData[1];
    setSchoolMetadata(schoolMetadata);
    setCurrentData(currentData);

    fetchDataFromURL({ url: chartDataUrl, extension: 'json', needsAuthorization: true })
      .then(data => {
        setChartDataForDashboard(data);
      })
      .catch((error) => {
        console.log(error);
      })


  }

  return (
    <>
      <Project
        themePreference={themePreference}
        schoolMetadata={schoolMetadata}
        currentData={currentData}
        dashboardData={chartDataForDashboard}
        fetchDataForDashboard={fetchDataForDashboard}
        temperatureUnitPreference={temperatureUnitPreference}
      />
    </>
  )
};

export default Dashboard;