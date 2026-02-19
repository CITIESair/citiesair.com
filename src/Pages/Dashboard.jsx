import { useEffect, useContext } from "react";

import Project from "./Project/Project";

import { PreferenceContext } from "../ContextProviders/PreferenceContext";

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
  const { setCurrentPage } = useContext(PreferenceContext);
  useEffect(() => {
    setCurrentPage(AppRoutes.dashboard);
  }, [setCurrentPage]);

  return (
    <Project />
  )
};

export default Dashboard;