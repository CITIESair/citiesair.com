// disable eslint for this file
/* eslint-disable */

import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";

import { fetchDataFromURL } from "../../Components/DatasetDownload/DatasetFetcher";
import Project from "../Project/Project";
import { processCurrentSensorsData } from "../../Utils/ApiUtils";
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

  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  // useEffect(() => {
  //   if (user.checkedAuthentication === true && user.authenticated === false) {
  //     navigate('/login');
  //   }
  // }, [user])

  const [dashboardData, setDashboardData] = useState({});
  const [currentSchoolData, setCurrentSchoolData] = useState({
    school_id: null,
    name: null,
    contactPerson: null,
    contactEmail: null,
    sensors: null
  });

  const fetchDashboardData = (optionalSchoolID) => {
    let url;
    if (optionalSchoolID) url = `https://api.citiesair.com/dashboard/${optionalSchoolID}`;
    else url = 'https://api.citiesair.com/dashboard';

    fetchDataFromURL(url, 'json', true)
      .then(data => {
        if (data.currentSchool?.sensors) {
          const processedCurrentSensorData = processCurrentSensorsData(data.currentSchool?.sensors);
          setCurrentSchoolData({
            ...data.currentSchool, sensors: processedCurrentSensorData
          });
        }
        else {
          setCurrentSchoolData(data.currentSchool);
        }

        setDashboardData(data.dashboard);
      })
  }

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <>
      <Project
        themePreference={themePreference}
        currentSchoolData={currentSchoolData}
        dashboardData={dashboardData}
        fetchDashboardData={fetchDashboardData}
        temperatureUnitPreference={temperatureUnitPreference}
      />
    </>
  )
};

export default Dashboard;