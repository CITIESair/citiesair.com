// disable eslint for this file
/* eslint-disable */
import { useEffect, useContext } from "react";

import Project from "./Project/Project";

import { MetadataContext } from "../ContextProviders/MetadataContext";

import { AppRoutes } from "../Utils/AppRoutes";
import { CITIESair, NUMBER_OF_CHARTS_TO_LOAD_INITIALLY } from "../Utils/GlobalVariables";
import { UserContext } from "../ContextProviders/UserContext";
import { DashboardContext } from "../ContextProviders/DashboardContext";
import { ChartAPIendpointsOrder } from "../API/Utils";
import { fetchDataFromURL } from "../API/ApiFetch";
import { getChartApiUrl } from "../API/ApiUrls";

const Dashboard = () => {
  const { user } = useContext(UserContext);
  const { loadMoreCharts, setIndividualChartData, currentSchoolID } = useContext(DashboardContext);

  // Update the page's title based on currentSchoolID
  useEffect(() => {
    if (!currentSchoolID) return;

    document.title = `${CITIESair} | ${currentSchoolID.toUpperCase()}`;
  }, [currentSchoolID]);

  // Update current page type
  const { setCurrentPage } = useContext(MetadataContext);
  useEffect(() => {
    setCurrentPage(AppRoutes.dashboard);
  }, []);

  // Fetch data for the project
  useEffect(() => {
    if (!currentSchoolID) return;

    const chartsToFetch = loadMoreCharts ? ChartAPIendpointsOrder : ChartAPIendpointsOrder.slice(0, NUMBER_OF_CHARTS_TO_LOAD_INITIALLY);
    chartsToFetch.forEach((endpoint, index) => {
      setIndividualChartData(index, {}); // set empty chartData to create a placeholder for this chart

      fetchDataFromURL({
        url: getChartApiUrl({
          endpoint: endpoint,
          school_id: currentSchoolID
        })
      })
        .then(data => {
          setIndividualChartData(index, data);
        })
        .catch((error) => {
          console.log(error);
        })
    });
  }, [user, currentSchoolID]);

  return (
    <Project />
  )
};

export default Dashboard;