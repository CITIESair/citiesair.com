import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useContext } from "react";
import { DashboardContext } from "../../ContextProviders/DashboardContext";
import { UserContext } from "../../ContextProviders/UserContext";
import { getAlertsApiUrl } from "../../API/ApiUrls";
import { GeneralAPIendpoints, RESTmethods } from "../../API/Utils";
import { fetchDataFromURL } from "../../API/ApiFetch";
import { addChildToAlerts, AirQualityAlertKeys } from "../../Components/AirQuality/AirQualityAlerts/AlertUtils";

export const useDeleteAlertMutation = () => {
    const queryClient = useQueryClient();
    const { currentSchoolID } = useContext(DashboardContext);
    const { user } = useContext(UserContext);

    return useMutation({
        mutationFn: async ({ alertId }) => {
            const url = getAlertsApiUrl({
                endpoint: GeneralAPIendpoints.alerts,
                school_id: currentSchoolID,
                alert_id: alertId
            });
            return fetchDataFromURL({ url, restMethod: RESTmethods.DELETE });
        },
        onSuccess: (_, { alertId }) => {
            queryClient.setQueryData(
                [GeneralAPIendpoints.alerts, currentSchoolID, user.username || user.email],
                (old = []) => {
                    const updated = old.filter(
                        alert => alert[AirQualityAlertKeys.id] !== alertId
                    );
                    return addChildToAlerts(updated);
                }
            );
        }
    });
};