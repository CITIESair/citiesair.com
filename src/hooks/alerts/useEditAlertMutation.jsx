import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useContext } from "react";
import { DashboardContext } from "../../ContextProviders/DashboardContext";
import { UserContext } from "../../ContextProviders/UserContext";
import { getAlertsApiUrl } from "../../API/ApiUrls";
import { GeneralAPIendpoints, RESTmethods } from "../../API/Utils";
import { addChildToAlerts, AirQualityAlertKeys } from "../../Components/AirQuality/AirQualityAlerts/AlertUtils";
import { fetchDataFromURL } from "../../API/ApiFetch";

export const useEditAlertMutation = () => {
    const queryClient = useQueryClient();
    const { currentSchoolID } = useContext(DashboardContext);
    const { user } = useContext(UserContext);

    return useMutation({
        mutationFn: async ({ alertId, alertToEdit }) => {
            const url = getAlertsApiUrl({
                endpoint: GeneralAPIendpoints.alerts,
                school_id: currentSchoolID,
                alert_id: alertId
            });

            return fetchDataFromURL({
                url,
                restMethod: RESTmethods.PUT,
                body: alertToEdit
            });
        },
        onSuccess: (editedAlert, { alertId }) => {
            queryClient.setQueryData(
                [GeneralAPIendpoints.alerts, currentSchoolID, user.username || user.email],
                (old = []) => addChildToAlerts(old.map(alert =>
                    alert[AirQualityAlertKeys.id] === alertId
                        ? editedAlert
                        : alert
                ))
            );
        }
    });
};