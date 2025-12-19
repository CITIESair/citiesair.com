import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useContext } from "react";
import { DashboardContext } from "../../ContextProviders/DashboardContext";
import { UserContext } from "../../ContextProviders/UserContext";
import { getApiUrl } from "../../API/APIUtils";
import { addChildToAlerts } from "../../Components/AirQuality/AirQualityAlerts/AlertUtils";
import { fetchDataFromURL } from "../../API/ApiFetch";

export const useCreateAlertMutation = () => {
    const queryClient = useQueryClient();
    const { currentSchoolID } = useContext(DashboardContext);
    const { user } = useContext(UserContext);

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