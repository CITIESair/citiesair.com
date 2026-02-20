import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getApiUrl } from "../../API/APIUtils";
import { addChildToAlerts } from "../../Components/AirQuality/AirQualityAlerts/AlertUtils";
import { fetchDataFromURL } from "../../API/ApiFetch";
import { useUser } from "../../ContextProviders/UserContext";
import { useDashboard } from "../../ContextProviders/DashboardContext";

export const useCreateAlertMutation = () => {
    const queryClient = useQueryClient();
    const { currentSchoolID } = useDashboard();
    const { user } = useUser();

    return useMutation({
        mutationFn: async ({ alertToCreate }) => {
            return fetchDataFromURL({
                url: getApiUrl({
                    endpoint: "alerts",
                    paths: [currentSchoolID]
                }),
                RESTmethod: "POST",
                body: alertToCreate
            });
        },
        onSuccess: (createdAlert) => {
            queryClient.setQueryData(
                ["alerts", currentSchoolID, user.username || user.email],
                (old = []) => addChildToAlerts([...old, createdAlert])
            );
        }
    });
};