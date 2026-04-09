import { Box, ToggleButtonGroup, ToggleButton, Typography, Stack, useTheme } from "@mui/material";
import { cloneElement, isValidElement } from "react";
import type { ReactElement } from "react";
import parse from "html-react-parser";

import { replacePlainHTMLWithMuiComponents } from "../../Utils/UtilFunctions";
import sectionData from "../../SectionData/sectionData";
import type { AuthSection } from "../../types/SectionData";
import { AppRoutes } from "../../Utils/AppRoutes";
import { UserRoles, UserRoleKeysForLogin, type UserRoleId } from "./Utils";
import { useUser } from "../../ContextProviders/UserContext";

type UserTypeSelectorProps = {
    route?: string;
};

const UserTypeSelector = ({ route = AppRoutes.login }: UserTypeSelectorProps) => {
    const { userRole, setUserRole } = useUser();
    const theme = useTheme();

    const getLabelContent = (): string => {
        const cleanedRoute = route.startsWith("/") ? route.slice(1) : route;

        // Only show content for login and signup routes
        const validRoutes = [AppRoutes.login.slice(1), AppRoutes.signUp.slice(1)] as const;
        if (!validRoutes.includes(cleanedRoute as any)) return "";

        // Type-safe access to AuthSection content
        const section = sectionData[cleanedRoute as 'login' | 'signup'] as AuthSection;
        const content = section.content;

        // Dynamically return content for the current user role (scales with new roles)
        return content[userRole as keyof typeof content] ?? "";
    };

    return (
        <Stack direction="column" gap={3}>
            <Box display="flex" justifyContent="center" alignItems="center">
                <ToggleButtonGroup
                    color="primary"
                    exclusive
                    value={userRole}
                    onChange={(_, value: string | null) => {
                        if (value) setUserRole(value as UserRoleId);
                    }}
                    sx={{ width: "100%" }}
                >
                    {UserRoleKeysForLogin.map((roleKey) => {
                        const role = UserRoles[roleKey];
                        return (
                            <ToggleButton
                                key={roleKey}
                                value={roleKey}
                                sx={{
                                    width: `${100 / UserRoleKeysForLogin.length}%`,
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
                        );
                    })}
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
