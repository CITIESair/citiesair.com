import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useUser } from "../../ContextProviders/UserContext";
import { getApiUrl } from "../../API/APIUtils";
import { addChildToAlerts, AirQualityAlertKeys } from "../../Components/AirQuality/AirQualityAlerts/AlertUtils";
import { fetchDataFromURL } from "../../API/ApiFetch";
import { useDashboard } from "../../ContextProviders/DashboardContext";

export const useEditAlertMutation = () => {
    const queryClient = useQueryClient();
    const { currentSchoolID } = useDashboard();
    const { user } = useUser();

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