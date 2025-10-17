import { useEffect, useContext } from "react";

import Project from "./Project/Project";

import { MetadataContext } from "../ContextProviders/MetadataContext";

import { AppRoutes } from "../Utils/AppRoutes";
import { CITIESair } from "../Utils/GlobalVariables";
import { DashboardContext } from "../ContextProviders/DashboardContext";

const Dashboard = () => {
  const { currentSchoolID } = useContext(DashboardContext);

  // Update the page's title based on currentSchoolID
  useEffect(() => {
    if (!currentSchoolID) return;

    document.title = `${CITIESair} | ${currentSchoolID.toUpperCase()}`;
  }, [currentSchoolID]);

  // Update current page type
  const { setCurrentPage } = useContext(MetadataContext);
  useEffect(() => {
    setCurrentPage(AppRoutes.dashboard);
  }, [setCurrentPage]);

  return (
    <Project />
  )
};

export default Dashboard;