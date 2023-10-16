// disable eslint for this file
/* eslint-disable */

import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";

import { fetchDataFromURL } from "../../Components/DatasetDownload/DatasetFetcher";
import Project from "../Project/Project";
import { processCurrentData } from "../../Utils/ApiUtils";
import { LinkContext } from "../../ContextProviders/LinkContext";

import { UserContext } from "../../ContextProviders/UserContext";

const Dashboard = ({ themePreference, temperatureUnitPreference, title }) => {
  // Update the page's title
  useEffect(() => {
    document.title = title;
  }, [title]);

  const [_, setCurrentPage, __, ___] = useContext(LinkContext);
  useEffect(() => {
    setCurrentPage('dashboard');
  }, []);

  const { authenticated, checkAuthentication } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (checkAuthentication && !authenticated) {
      navigate('/login');
    }
  }, [authenticated, checkAuthentication])

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
        temperatureUnitPreference={temperatureUnitPreference}
      />
    </>
  )
};

export default Dashboard;