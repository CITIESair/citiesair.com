import { useContext } from "react";
import { DashboardContext } from "../../ContextProviders/DashboardContext";
import { UserContext } from "../../ContextProviders/UserContext";
import { useQuery } from "@tanstack/react-query";
import { fetchDataFromURL } from "../../API/ApiFetch";
import { getAlertsApiUrl } from "../../API/ApiUrls";
import { GeneralAPIendpoints } from "../../API/Utils";
import { isValidArray } from "../../Utils/UtilFunctions";
import { addChildToAlerts } from "../../Components/AirQuality/AirQualityAlerts/AlertUtils";

export const useAlerts = () => {
    const { currentSchoolID } = useContext(DashboardContext);
    const { authenticationState, user } = useContext(UserContext);

    const queryResult = useQuery({
        queryKey: [GeneralAPIendpoints.alerts, currentSchoolID, user.username || user.email],
        queryFn: async () => {

            const data = await fetchDataFromURL({
                url: getAlertsApiUrl({
                    endpoint: GeneralAPIendpoints.alerts,
                    school_id: currentSchoolID,
                }),
            });

            if (!isValidArray(data)) return [];
            return addChildToAlerts(data);
        },
        enabled: !!currentSchoolID && !!authenticationState.authenticated,
        staleTime: 0,
        retry: false,
        refetchOnWindowFocus: false,
    });

    // Always return at least an empty array for `data`
    return {
        ...queryResult,
        data: queryResult.data ?? [],
    };
};