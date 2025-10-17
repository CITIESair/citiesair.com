import { useState, createContext, useMemo, useEffect, useContext } from 'react';
import { ChartAPIendpointsOrder } from '../API/Utils';
import { AppRoutes } from '../Utils/AppRoutes';
import { NYUAD } from '../Utils/GlobalVariables';
import { LocalStorage } from '../Utils/LocalStorage';
import { SnackbarMetadata } from '../Utils/SnackbarMetadata';
import { isValidArray } from '../Utils/UtilFunctions';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { UserContext } from './UserContext';
import { enqueueSnackbar } from 'notistack';

export const DashboardContext = createContext("");

export function DashboardProvider({ children }) {
  const navigate = useNavigate();

  const { school_id_param } = useParams();
  const { user, authenticationState } = useContext(UserContext);

  const location = useLocation();
  const locationPath = location.pathname;
  const isDashboardPage = locationPath.includes(AppRoutes.dashboard);

  const [currentSchoolID, setCurrentSchoolID] = useState();

  const [allChartsConfigs, setAllChartsConfigs] = useState(() =>
    ChartAPIendpointsOrder.reduce((acc, endpoint, index) => {
      acc[index] = { endpoint, queryParams: {} };
      return acc;
    }, {})
  );
  const [allChartsData, setAllChartsData] = useState({});
  const [loadMoreCharts, setLoadMoreCharts] = useState(false);

  /** --- SETTERS --- **/
  const setIndividualChartConfig = (chartID, chartConfig) => {
    setAllChartsConfigs(prevData => ({
      ...prevData,
      [chartID]: chartConfig
    }));
  };

  const updateIndividualChartConfigQueryParams = (chartID, newQueryParams) => {
    setAllChartsConfigs(prev => ({
      ...prev,
      [chartID]: {
        ...prev[chartID],
        queryParams: {
          ...prev[chartID].queryParams,
          ...newQueryParams
        }
      }
    }));
  };


  const setIndividualChartData = (chartID, chartData) => {
    setAllChartsData(prevData => ({
      ...prevData,
      [chartID]: chartData
    }));
  };

  const providerValue = useMemo(() => ({
    currentSchoolID, setCurrentSchoolID,
    allChartsConfigs, setIndividualChartConfig, updateIndividualChartConfigQueryParams,
    allChartsData, setIndividualChartData,
    loadMoreCharts, setLoadMoreCharts
  }), [currentSchoolID, allChartsConfigs, allChartsData, loadMoreCharts]);

  /** --- AUTH / SCHOOL SELECTION LOGIC --- **/
  useEffect(() => {
    if (!authenticationState.checkedAuthentication) return;

    // CASE: NYUAD BANNER
    if (locationPath === AppRoutes.nyuadBanner) {
      setCurrentSchoolID(NYUAD);
      return;
    }

    // If the user isn't logged in (after checking authentication status)
    // Navigate to the login if in dashboard page (rather than NYUAD)
    // or just set to NYUAD if in homepage
    if (authenticationState.authenticated === false) {
      if (school_id_param === NYUAD || locationPath === AppRoutes.home) {
        setCurrentSchoolID(NYUAD);
        return;
      }

      if (isDashboardPage) {
        navigate(`${AppRoutes.login}?${AppRoutes.redirectQuery}=${locationPath}`);
        return;
      }
    }

    // Only authenticated users below this line
    if (isValidArray(user.allowedSchools)) {
      // If no school_id_param is given
      if (!school_id_param) {
        let school_id;

        // If there has been a previouslySelectedSchoolID, then load dashboard data for this one
        const previouslySelectedSchoolID = localStorage.getItem(LocalStorage.schoolID);

        if (user.allowedSchools.map((school) => school.school_id).includes(previouslySelectedSchoolID)) {
          school_id = previouslySelectedSchoolID;
          setCurrentSchoolID(school_id);
        }
        // If not existed yet, then just get the first school in the list
        else {
          school_id = user.allowedSchools[0].school_id;
          setCurrentSchoolID(school_id);
          localStorage.setItem(LocalStorage.schoolID, school_id);
        }

        if (isDashboardPage) {
          navigate(school_id, { replace: true }); // navigate to the correct url: /dashboard/:school_id_param
        }
      }
      // If there is school_id_param, check if school_id_param is in the allowedSchools
      else {
        if (user.allowedSchools.map((school) => school.school_id).includes(school_id_param)) {
          setCurrentSchoolID(school_id_param);
          localStorage.setItem(LocalStorage.schoolID, school_id_param);
        }
        // If the school_id_param is not in the allowedSchools
        else {
          // NYUAD case
          if (school_id_param === NYUAD) {
            setCurrentSchoolID(NYUAD);
          } else {
            enqueueSnackbar("You don't have permission to view this school or this school does not exist.", SnackbarMetadata.error);
            navigate(AppRoutes[404], { replace: true });
          }
        }
      }
    } else {
      setCurrentSchoolID(NYUAD);
      if (isDashboardPage) {
        navigate(AppRoutes.nyuad); // else, if there is no valid allowedSchools for this user, route to public NYUAD dashboard
      }
    }
  }, [user, authenticationState, school_id_param, isDashboardPage, locationPath, navigate]);

  return (
    <DashboardContext.Provider value={providerValue}>
      {children}
    </DashboardContext.Provider>
  );
}
