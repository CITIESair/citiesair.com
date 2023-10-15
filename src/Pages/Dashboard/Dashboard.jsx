// disable eslint for this file
/* eslint-disable */

import { useState, useEffect, useContext } from "react";
import { Box, Chip } from "@mui/material";

import { fetchDataFromURL } from "../../Components/DatasetDownload/DatasetFetcher";
import Project from "../Project/Project";
import { processCurrentData } from "../../Utils/ApiUtils";
import { LinkContext } from "../../ContextProviders/LinkContext";

const Dashboard = ({ themePreference, title }) => {
  // Update the page's title
  useEffect(() => {
    document.title = title;
  }, [title]);

  const [_, setCurrentPage, __, ___] = useContext(LinkContext);
  useEffect(() => {
    setCurrentPage('dashboard');
  }, []);

  const [dashboardData, setDashboardData] = useState({});
  const [currentSensorData, setCurrentSensorData] = useState({});
  const [allowedSchools, setAllowedSchools] = useState([]);

  const fetchDashboardData = (schoolID) => {
    let url;
    if (schoolID) url = `https://api.citiesair.com/dashboard/${schoolID}`;
    else url = 'https://api.citiesair.com/dashboard';

    fetchDataFromURL(url, 'json', true)
      .then(data => {
        if (data.currentSchool?.sensors) {
          const processedCurrentSensorData = processCurrentData(data.currentSchool?.sensors);
          setCurrentSensorData(processedCurrentSensorData);
        }
        setDashboardData(data);
        setAllowedSchools(data.allowedSchools || []);
      })
  }

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <>
      <Project
        themePreference={themePreference}
        currentSensorData={currentSensorData}
        dashboardData={dashboardData}
        fetchDashboardData={fetchDashboardData}
      />
    </>
  )
};

export default Dashboard;