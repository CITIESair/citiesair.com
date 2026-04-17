import { useState, createContext, useContext, useMemo, useEffect, ReactNode } from 'react';
import { ChartAPIEndpointsOrder } from '../API/APIUtils';
import { AppRoutes } from '../Utils/AppRoutes';
import { NYUAD } from '../Utils/GlobalVariables';
import { LocalStorage } from '../Utils/LocalStorage';
import { SnackbarMetadata } from '../Utils/SnackbarMetadata';
import { isValidArray } from '../Utils/UtilFunctions';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { enqueueSnackbar } from 'notistack';
import { useUser } from './UserContext';

interface ChartConfig {
  endpoint: string;
  queryParams: Record<string, any>;
}

interface ChartData {
  [key: string]: any;
}

interface DashboardContextType {
  currentSchoolID: string | undefined;
  setCurrentSchoolID: (schoolID: string | undefined) => void;
  allChartsConfigs: Record<number, ChartConfig>;
  setIndividualChartConfig: (chartID: number, chartConfig: ChartConfig) => void;
  updateIndividualChartConfigQueryParams: (chartID: number, newQueryParams: Record<string, any>) => void;
  allChartsData: Record<number, ChartData>;
  setIndividualChartData: (chartID: number, chartData: ChartData) => void;
  loadMoreCharts: boolean;
  setLoadMoreCharts: (load: boolean) => void;
}

interface DashboardProviderProps {
  children: ReactNode;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function DashboardProvider({ children }: DashboardProviderProps) {
  const navigate = useNavigate();

  const { school_id_param } = useParams<{ school_id_param: string }>();
  const { user, authenticationState } = useUser();

  const location = useLocation();
  const locationPath = location.pathname;
  const isDashboardPage = locationPath.includes(AppRoutes.dashboard);

  const [currentSchoolID, setCurrentSchoolID] = useState<string | undefined>();

  const [allChartsConfigs, setAllChartsConfigs] = useState<Record<number, ChartConfig>>(() =>
    ChartAPIEndpointsOrder.reduce((acc, endpoint, index) => {
      acc[index] = { endpoint, queryParams: {} };
      return acc;
    }, {} as Record<number, ChartConfig>)
  );
  const [allChartsData, setAllChartsData] = useState<Record<number, ChartData>>({});
  const [loadMoreCharts, setLoadMoreCharts] = useState<boolean>(false);

  /** --- SETTERS --- **/
  const setIndividualChartConfig = (chartID: number, chartConfig: ChartConfig) => {
    setAllChartsConfigs(prevData => ({
      ...prevData,
      [chartID]: chartConfig
    }));
  };

  const updateIndividualChartConfigQueryParams = (chartID: number, newQueryParams: Record<string, any>) => {
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

  const setIndividualChartData = (chartID: number, chartData: ChartData) => {
    setAllChartsData(prevData => ({
      ...prevData,
      [chartID]: chartData
    }));
  };

  const providerValue = useMemo<DashboardContextType>(() => ({
    currentSchoolID, setCurrentSchoolID,
    allChartsConfigs, setIndividualChartConfig, updateIndividualChartConfigQueryParams,
    allChartsData, setIndividualChartData,
    loadMoreCharts, setLoadMoreCharts
  }), [currentSchoolID, allChartsConfigs, allChartsData, loadMoreCharts]);

  /** --- AUTH / SCHOOL SELECTION LOGIC --- **/
  useEffect(() => {
    if (!authenticationState.checkedAuthentication || !isValidArray(user.allowedSchools)) return;

    // CASE: NYUAD or all sensor screen
    if (locationPath === AppRoutes.nyuadBanner || locationPath === AppRoutes.nyuadMap) {
      setCurrentSchoolID(NYUAD);
      return;
    }

    // If the user isn't logged in (after checking authentication status)
    if (authenticationState.authenticated === false) {
      // If in home, set to the first publicly available institution in allowedSchools
      if (locationPath === AppRoutes.home) {
        setCurrentSchoolID(user.allowedSchools[0].school_id);
      }

      // Elsewhere, set to school_id_param or navigate to login page
      else if (school_id_param && user.allowedSchools.map(school => school.school_id).includes(school_id_param)) {
        setCurrentSchoolID(school_id_param);
        return;
      } else {
        navigate(`${AppRoutes.login}?${AppRoutes.redirectQuery}=${locationPath}`);
      }
      return;
    }

    // Only authenticated users below this line
    if (isValidArray(user.allowedSchools)) {
      // If no school_id_param is given
      if (!school_id_param) {
        let school_id: string;

        // If there has been a previouslySelectedSchoolID, then load dashboard data for this one
        const previouslySelectedSchoolID = localStorage.getItem(LocalStorage.schoolId);

        if (previouslySelectedSchoolID && user.allowedSchools.map((school) => school.school_id).includes(previouslySelectedSchoolID)) {
          school_id = previouslySelectedSchoolID;
          setCurrentSchoolID(school_id);
        }
        // If not existed yet, then just get the first school in the list
        else {
          school_id = user.allowedSchools[0].school_id;
          setCurrentSchoolID(school_id);
          localStorage.setItem(LocalStorage.schoolId, school_id);
        }

        if (isDashboardPage) {
          navigate(school_id, { replace: true }); // navigate to the correct url: /dashboard/:school_id_param
        }
      }
      // If there is school_id_param, check if school_id_param is in the allowedSchools
      else {
        if (user.allowedSchools.map((school) => school.school_id).includes(school_id_param)) {
          setCurrentSchoolID(school_id_param);
          localStorage.setItem(LocalStorage.schoolId, school_id_param);
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

export const useDashboard = (): DashboardContextType => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within DashboardProvider');
  }
  return context;
};
