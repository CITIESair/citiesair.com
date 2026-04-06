import { Box, ToggleButtonGroup, ToggleButton, Typography, Stack, useTheme } from "@mui/material";
import { cloneElement, isValidElement } from "react";
import type { ReactElement } from "react";
import parse from "html-react-parser";

import { replacePlainHTMLWithMuiComponents } from "../../Utils/UtilFunctions";
import sectionData from "../../SectionData/sectionData";
import { AppRoutes } from "../../Utils/AppRoutes";
import { UserRolesForLogin } from "./Utils";
import { useUser } from "../../ContextProviders/UserContext";

type UserTypeSelectorProps = {
    route?: string;
};

const UserTypeSelector = ({ route = AppRoutes.login }: UserTypeSelectorProps) => {
    const { userRole, setUserRole } = useUser();
    const theme = useTheme();

    const getLabelContent = (): string => {
        const cleanedRoute = route.startsWith("/") ? route.slice(1) : route;

        if (cleanedRoute !== "login" && cleanedRoute !== "signup") return "";

        const content = sectionData[cleanedRoute].content;
        if (userRole === "school") return content.school;
        if (userRole === "individual") return content.individual;
        return "";
    };

    return (
        <Stack direction="column" gap={3}>
            <Box display="flex" justifyContent="center" alignItems="center">
                <ToggleButtonGroup
                    color="primary"
                    exclusive
                    value={userRole}
                    onChange={(_, value: string | null) => {
                        if (value) setUserRole(value);
                    }}
                    sx={{ width: "100%" }}
                >
                    {UserRolesForLogin.map((role) => (
                        <ToggleButton
                            key={role.id}
                            value={role.id}
                            sx={{
                                width: `${100 / UserRolesForLogin.length}%`,
                                flexDirection: "column",
                                py: 3,
                            }}
                        >
                            {role.loginLabels?.icon &&
                                (isValidElement(role.loginLabels.icon)
                                    ? cloneElement(role.loginLabels.icon as ReactElement, { fontSize: "large" })
                                    : role.loginLabels.icon)}
                            <Typography sx={{ typography: { sm: "h6", xs: "body1" } }} mt={1}>
                                <Box fontWeight={500}>{role.name}</Box>
                            </Typography>
                        </ToggleButton>
                    ))}
                </ToggleButtonGroup>
            </Box>

            <Typography
                sx={{
                    pl: 1,
                    borderLeftColor: theme.palette.primary.main,
                    borderLeftWidth: "2px",
                    borderLeftStyle: "solid",
                }}
                color="text.secondary"
                fontStyle="italic"
            >
                {parse(getLabelContent(), {
                    replace: replacePlainHTMLWithMuiComponents,
                })}
            </Typography>
        </Stack>
    );
};

export default UserTypeSelector;
