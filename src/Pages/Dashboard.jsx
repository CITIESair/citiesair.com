import { useEffect } from "react";
import Project from "./Project/Project";
import { AppRoutes } from "../Utils/AppRoutes";
import { CITIESair } from "../Utils/GlobalVariables";
import { usePreferences } from "../ContextProviders/PreferenceContext";
import { useDashboard } from "../ContextProviders/DashboardContext";

const Dashboard = () => {
  const { currentSchoolID } = useDashboard();

  // Update the page's title based on currentSchoolID
  useEffect(() => {
    if (!currentSchoolID) return;

    document.title = `${CITIESair} | ${currentSchoolID.toUpperCase()}`;
  }, [currentSchoolID]);

  // Update current page type
  const { setCurrentPage } = usePreferences();
  useEffect(() => {
    setCurrentPage(AppRoutes.dashboard);
  }, [setCurrentPage]);

  return (
    <Project />
  )
};

export default Dashboard;