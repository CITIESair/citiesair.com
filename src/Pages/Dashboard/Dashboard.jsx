// disable eslint for this file
/* eslint-disable */

import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";

import { fetchDataFromURL } from "../../Components/DatasetDownload/DatasetFetcher";
import Project from "../Project/Project";
import { EndPoints, fetchAndProcessCurrentSensorsData, getApiUrl } from "../../Utils/ApiUtils";
import { LinkContext } from "../../ContextProviders/LinkContext";

import { UserContext } from "../../ContextProviders/UserContext";
import { LocalStorage } from "../../Utils/LocalStorage";

const Dashboard = ({ themePreference, temperatureUnitPreference, title }) => {
  // Update the page's title
  useEffect(() => {
    document.title = title;
  }, [title]);

  const [_, setCurrentPage, __, ___] = useContext(LinkContext);
  useEffect(() => {
    setCurrentPage('dashboard');
  }, []);

  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const emptySchoolMetadata = {};
  const [schoolMetadata, setSchoolMetadata] = useState(emptySchoolMetadata);
  const emptyCurrentData = null;
  const [currentData, setCurrentData] = useState(emptyCurrentData);
  const emptyChartDataForDashboard = {};
  const [chartDataForDashboard, setChartDataForDashboard] = useState(emptyChartDataForDashboard);

  useEffect(() => {
    if (user.checkedAuthentication === true && user.authenticated === false) {
      navigate('/login');
    }

    const allowedSchools = user.allowedSchools;
    if (Array.isArray(allowedSchools) && allowedSchools.length > 0) {
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
    }
  }, [user]);

  const fetchDataForDashboard = (school_id) => {
    const schoolMetadataUrl = getApiUrl({
      endpoint: EndPoints.schoolmetadata,
      school_id: school_id
    });

    setSchoolMetadata(emptySchoolMetadata);
    setCurrentData(emptyCurrentData);
    setChartDataForDashboard({ ...chartDataForDashboard, charts: null });

    fetchDataFromURL(schoolMetadataUrl, 'json', true)
      .then(data => {
        setSchoolMetadata(data);

        // Only call currentData after schoolMetadata is received
        const currentUrl = getApiUrl({
          endpoint: EndPoints.current,
          school_id: school_id
        });

        fetchAndProcessCurrentSensorsData(currentUrl)
          .then((data) => {
            setCurrentData(data);

            // Only call chartData after currentData is received
            const chartDataUrl = getApiUrl({
              endpoint: EndPoints.chartdata,
              school_id: school_id
            });
            fetchDataFromURL(chartDataUrl, 'json', true)
              .then(data => {
                setChartDataForDashboard(data);
              })
              .catch((error) => {
                console.log(error);
              })

          })
          .catch((error) => {
            console.log(error);
          })
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