import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useContext } from "react";
import { DashboardContext } from "../../ContextProviders/DashboardContext";
import { UserContext } from "../../ContextProviders/UserContext";
import { getApiUrl } from "../../API/APIUtils";
import { fetchDataFromURL } from "../../API/ApiFetch";
import { addChildToAlerts, AirQualityAlertKeys } from "../../Components/AirQuality/AirQualityAlerts/AlertUtils";

export const useDeleteAlertMutation = () => {
    const queryClient = useQueryClient();
    const { currentSchoolID } = useContext(DashboardContext);
    const { user } = useContext(UserContext);

    return useMutation({
        mutationFn: async ({ alertId }) => {
            const url = getApiUrl({
                endpoint: "alerts",
                paths: [currentSchoolID, alertId]
            });
            return fetchDataFromURL({ url, RESTmethod: "DELETE" });
        },
        onSuccess: (_, { alertId }) => {
            queryClient.setQueryData(
                ["alerts", currentSchoolID, user.username || user.email],
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