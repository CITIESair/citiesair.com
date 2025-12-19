import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useContext } from "react";
import { DashboardContext } from "../../ContextProviders/DashboardContext";
import { UserContext } from "../../ContextProviders/UserContext";
import { getApiUrl } from "../../API/APIUtils";
import { addChildToAlerts, AirQualityAlertKeys } from "../../Components/AirQuality/AirQualityAlerts/AlertUtils";
import { fetchDataFromURL } from "../../API/ApiFetch";

export const useEditAlertMutation = () => {
    const queryClient = useQueryClient();
    const { currentSchoolID } = useContext(DashboardContext);
    const { user } = useContext(UserContext);

    return useMutation({
        mutationFn: async ({ alertId, alertToEdit }) => {
            return fetchDataFromURL({
                url: getApiUrl({
                    endpoint: "alerts",
                    paths: [currentSchoolID, alertId]
                }),
                RESTmethod: "PUT",
                body: alertToEdit
            });
        },
        onSuccess: (editedAlert, { alertId }) => {
            queryClient.setQueryData(
                ["alerts", currentSchoolID, user.username || user.email],
                (old = []) => addChildToAlerts(old.map(alert =>
                    alert[AirQualityAlertKeys.id] === alertId
                        ? editedAlert
                        : alert
                ))
            );
        }
    });
};