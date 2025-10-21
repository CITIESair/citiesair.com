import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useContext } from "react";
import { DashboardContext } from "../../ContextProviders/DashboardContext";
import { UserContext } from "../../ContextProviders/UserContext";
import { getAlertsApiUrl } from "../../API/ApiUrls";
import { GeneralAPIendpoints, RESTmethods } from "../../API/Utils";
import { addChildToAlerts } from "../../Components/AirQuality/AirQualityAlerts/AlertUtils";
import { fetchDataFromURL } from "../../API/ApiFetch";

export const useCreateAlertMutation = () => {
    const queryClient = useQueryClient();
    const { currentSchoolID } = useContext(DashboardContext);
    const { user } = useContext(UserContext);

    return useMutation({
        mutationFn: async ({ alertToCreate }) => {
            const url = getAlertsApiUrl({
                endpoint: GeneralAPIendpoints.alerts,
                school_id: currentSchoolID
            });

            return fetchDataFromURL({
                url,
                restMethod: RESTmethods.POST,
                body: alertToCreate
            });
        },
        onSuccess: (createdAlert) => {
            queryClient.setQueryData(
                [GeneralAPIendpoints.alerts, currentSchoolID, user.username || user.email],
                (old = []) => addChildToAlerts([...old, createdAlert])
            );
        }
    });
};